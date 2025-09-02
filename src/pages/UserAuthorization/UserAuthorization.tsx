import React, { useState, useRef, useCallback, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import type { DateObject } from "react-multi-date-picker";
import Webcam from "react-webcam";
import { loadLocalBlazeFaceModel, LocalBlazeFaceModel } from "../../utils/localModelLoader";
import { submitUserAuthorization } from "../../api/userAuthorization";
import type { UserAuthorizationData } from "../../api/userAuthorization";

const UserAuthorization: React.FC = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Form data for both steps
  const [formData, setFormData] = useState({
    mobileNumber: "",
    nationalId: "",
    dateOfBirth: null as DateObject | null,
    persianDateOfBirth: "", // Persian date string
    frontPhoto: null as string | null,
    backPhoto: null as string | null,
    recordedVideo: null as string | null,
    selfPhoto: null as string | null,
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    mobileNumber: "",
    nationalId: "",
    dateOfBirth: "",
  });

  // Camera states
  const [showCamera, setShowCamera] = useState<"front" | "back" | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  // Video recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // API states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Face detection states
  const [faceInCenter, setFaceInCenter] = useState(false);
  const [isFaceDetectionReady, setIsFaceDetectionReady] = useState(false);
  const [faceDetectionModel, setFaceDetectionModel] =
    useState<LocalBlazeFaceModel | null>(null);
  const [headRotationStep, setHeadRotationStep] = useState<
    "center" | "left" | "right" | "complete"
  >("center");
  const [headRotationProgress, setHeadRotationProgress] = useState({
    center: false,
    left: false,
    right: false,
  });

  // Refs for camera functionality
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize face detection model
  const initializeFaceDetection = useCallback(async () => {
    try {
      console.log("Starting face detection initialization...");
      const model = await loadLocalBlazeFaceModel();
      console.log("Face detection model loaded successfully:", model);
      setFaceDetectionModel(model);
      setIsFaceDetectionReady(true);
    } catch (error) {
      console.error("Error initializing face detection:", error);
      setIsFaceDetectionReady(false);
    }
  }, []);

  // Initialize face detection on component mount
  useEffect(() => {
    initializeFaceDetection();
  }, [initializeFaceDetection]);

  // Face detection function with head rotation detection
  const detectFaceInCenter = useCallback(async () => {
    if (
      !webcamRef.current?.video ||
      !canvasRef.current ||
      !faceDetectionModel ||
      currentStep !== 3
    ) {
      return;
    }

    try {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      // Ensure video is playing and has dimensions
      if (video.readyState !== 4 || !video.videoWidth || !video.videoHeight) {
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Use the new head rotation detection method
      const headRotationResult = await faceDetectionModel.detectHeadRotation(video);
      
      if (headRotationResult.pose) {
        // Update head rotation progress based on pose detection
        if (headRotationResult.isCenter) {
          setHeadRotationProgress((prev) => ({ ...prev, center: true }));
          setFaceInCenter(true);
        } else {
          setFaceInCenter(false);
        }

        if (headRotationResult.isLeft) {
          setHeadRotationProgress((prev) => ({ ...prev, left: true }));
        }

        if (headRotationResult.isRight) {
          setHeadRotationProgress((prev) => ({ ...prev, right: true }));
        }

        // Check if all rotations are complete
        setHeadRotationProgress((prev) => {
          if (prev.center && prev.left && prev.right) {
            setHeadRotationStep("complete");
          }
          return prev;
        });

        // Draw on canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw center circle
          const centerCircle = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.min(canvas.width, canvas.height) * 0.25,
          };

          ctx.strokeStyle = headRotationResult.isCenter ? "#10B981" : "#EF4444";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            centerCircle.x,
            centerCircle.y,
            centerCircle.radius,
            0,
            2 * Math.PI
          );
          ctx.stroke();

          // Draw pose information
          ctx.fillStyle = "#000";
          ctx.font = "16px Arial";
          ctx.textAlign = "left";
          ctx.fillText(`Yaw: ${headRotationResult.pose.yaw.toFixed(1)}°`, 10, 30);
          ctx.fillText(`Roll: ${headRotationResult.pose.roll.toFixed(1)}°`, 10, 50);
          ctx.fillText(`Pitch: ${headRotationResult.pose.pitch.toFixed(1)}°`, 10, 70);

          // Draw rotation status
          ctx.fillStyle = headRotationResult.isCenter ? "#10B981" : "#EF4444";
          ctx.fillText(`Center: ${headRotationResult.isCenter ? "✅" : "❌"}`, 10, 100);
          ctx.fillText(`Left: ${headRotationResult.isLeft ? "✅" : "⭕"}`, 10, 120);
          ctx.fillText(`Right: ${headRotationResult.isRight ? "✅" : "⭕"}`, 10, 140);
        }
      } else {
        setFaceInCenter(false);

        // Draw red circle when no face detected
        if (canvasRef.current && currentStep === 3) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerCircle = {
              x: canvas.width / 2,
              y: canvas.height / 2,
              radius: Math.min(canvas.width, canvas.height) * 0.25,
            };

            ctx.strokeStyle = "#EF4444";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(
              centerCircle.x,
              centerCircle.y,
              centerCircle.radius,
              0,
              2 * Math.PI
            );
            ctx.stroke();

            // Draw "No Face Detected" message
            ctx.fillStyle = "#EF4444";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText("چهره تشخیص داده نشد", canvas.width / 2, canvas.height / 2 + 50);
          }
        }
      }
    } catch (error) {
      console.error("Face detection error:", error);
      setFaceInCenter(false);
    }
  }, [faceDetectionModel, currentStep]);

  // Start face detection when camera is active in step 3
  useEffect(() => {
    if (
      showCamera &&
      currentStep === 3 &&
      isFaceDetectionReady &&
      faceDetectionModel &&
      isRecording
    ) {
      // Start face detection every 100ms for better performance and responsiveness
      const interval = setInterval(detectFaceInCenter, 100);
      faceDetectionIntervalRef.current = interval;

      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
      }
    }
  }, [
    showCamera,
    currentStep,
    isFaceDetectionReady,
    faceDetectionModel,
    detectFaceInCenter,
    isRecording,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
    };
  }, []);

  // Get video constraints based on camera type
  const getVideoConstraints = (type: "front" | "back") => ({
    width: 1280,
    height: 720,
    facingMode: type === "front" ? "user" : "environment",
  });

  // Get video constraints with specific camera device
  const getVideoConstraintsWithDevice = (
    type: "front" | "back",
    deviceId?: string
  ) => {
    if (deviceId) {
      return {
        width: 1280,
        height: 720,
        deviceId: { exact: deviceId },
      };
    }
    return getVideoConstraints(type);
  };

  // Load available cameras
  const loadAvailableCameras = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setAvailableCameras(videoDevices);

      // Auto-select camera based on type
      if (videoDevices.length > 0) {
        // Try to find front camera first (selfie camera)
        const frontCamera = videoDevices.find((device) => {
          const label = device.label.toLowerCase();
          return (
            label.includes("front") ||
            label.includes("user") ||
            label.includes("selfie") ||
            label.includes("前置") ||
            label.includes("selfie") ||
            label.includes("user-facing")
          );
        });

        // Try to find back camera (main camera)
        const backCamera = videoDevices.find((device) => {
          const label = device.label.toLowerCase();
          return (
            label.includes("back") ||
            label.includes("environment") ||
            label.includes("rear") ||
            label.includes("后置") ||
            label.includes("main") ||
            label.includes("environment-facing")
          );
        });

        // Select front camera if available, otherwise back camera, otherwise first camera
        if (frontCamera) {
          setSelectedCameraId(frontCamera.deviceId);
        } else if (backCamera) {
          setSelectedCameraId(backCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedCameraId(videoDevices[0].deviceId);
        }
      }
    } catch (error) {
      console.error("Error loading cameras:", error);
    }
  }, []);

  // Load available cameras on component mount
  useEffect(() => {
    loadAvailableCameras();
  }, [loadAvailableCameras]);

  // Handle camera selection change
  const handleCameraChange = (deviceId: string) => {
    setSelectedCameraId(deviceId);
  };

  // Camera functions
  const startCamera = async (type: "front" | "back") => {
    try {
      setCameraError(null);
      setIsCameraLoading(true);
      await loadAvailableCameras();
      setShowCamera(type);
    } catch (error) {
      console.error("Error starting camera:", error);
      setCameraError("خطا در شروع دوربین");
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    setShowCamera(null);
    setCameraError(null);
    setFaceInCenter(false);
    setIsCameraLoading(false);
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current && showCamera) {
      if (currentStep === 3) {
        // In step 3, we're recording video, not taking photo
        return;
      }

      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFormData((prev) => ({
          ...prev,
          [showCamera === "front" ? "frontPhoto" : "backPhoto"]: imageSrc,
        }));
        stopCamera();
      } else {
        setCameraError("خطا در گرفتن عکس");
      }
    }
  }, [showCamera, currentStep]);

  // Handle webcam errors
  const handleWebcamError = (error: string | DOMException) => {
    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError") {
        setCameraError(
          "دسترسی به دوربین رد شده است. لطفا مجوز دوربین را فعال کنید."
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("دوربین پیدا نشد. لطفا مطمئن شوید که دوربین متصل است.");
      } else if (error.name === "NotReadableError") {
        setCameraError("دوربین در حال استفاده توسط برنامه دیگری است.");
      } else {
        setCameraError(`خطای دوربین: ${error.message}`);
      }
    } else {
      setCameraError(`خطای دوربین: ${error}`);
    }
  };

  // Handle webcam user media error
  const handleUserMediaError = (error: string | DOMException) => {
    handleWebcamError(error);
  };

  // Video recording functions
  const startVideoRecording = async () => {
    setHeadRotationProgress({
      center: false,
      left: false,
      right: false,
    });
    setHeadRotationStep("center");

    try {
      if (!webcamRef.current) return;

      // First, take a selfie photo
      const selfiePhoto = webcamRef.current.getScreenshot();
      if (selfiePhoto) {
        setFormData((prev) => ({
          ...prev,
          selfPhoto: selfiePhoto,
        }));
        console.log("Selfie photo captured successfully");
      } else {
        console.error("Failed to capture selfie photo");
      }

      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (!stream) return;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);

        // Save video to form data
        setFormData((prev) => ({
          ...prev,
          recordedVideo: videoUrl,
        }));

        setIsRecording(false);
        setRecordingTime(0);
        setRecordingProgress(0);

        // Close camera modal after recording
        stopCamera();
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingProgress(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          setRecordingProgress((newTime / 30) * 100); // 30 seconds max
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting video recording:", error);
      setCameraError("خطا در شروع ضبط ویدیو");
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setFormData((prev) => ({ ...prev, recordedVideo: null }));
    setRecordingTime(0);
    setRecordingProgress(0);
  };

  // Validation functions
  const validateMobileNumber = (mobile: string): string => {
    if (!mobile) return "شماره همراه الزامی است";
    if (!/^09\d{9}$/.test(mobile))
      return "شماره همراه باید با 09 شروع شود و 11 رقم باشد";
    return "";
  };

  const validateNationalId = (nationalId: string): string => {
    if (!nationalId) return "کد ملی الزامی است";
    if (!/^\d{10}$/.test(nationalId)) return "کد ملی باید 10 رقم باشد";

    // Iranian National ID validation algorithm
    const digits = nationalId.split("").map(Number);
    const checkDigit = digits[9];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;
    const calculatedCheckDigit = remainder < 2 ? remainder : 11 - remainder;

    if (checkDigit !== calculatedCheckDigit) {
      return "کد ملی نامعتبر است";
    }

    return "";
  };

  const validateDateOfBirth = (date: DateObject | null): string => {
    if (!date) return "تاریخ تولد الزامی است";

    const today = new Date();

    // Convert Persian date to Gregorian using DateObject's built-in conversion
    const gregorianDate = date.convert(gregorian);

    
    const birthDate = new Date(
      gregorianDate.year,
      gregorianDate.month.number - 1,
      gregorianDate.day
    );
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) return "سن شما باید حداقل 18 سال باشد";
    if (age > 120) return "تاریخ تولد نامعتبر است";

    return "";
  };

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDateChange = (date: DateObject | null) => {
    // Convert to Persian date format with English numbers
    const persianDateObj = date ? date.convert(persian, persian_fa) : null;
    const persianDate = persianDateObj ? persianDateObj.format("YYYY/MM/DD") : "";
    
    // Convert Persian numerals to English numerals
    const persianToEnglishNumbers = (str: string) => {
      const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      return str.split('').map(char => {
        const index = persianNumbers.indexOf(char);
        return index !== -1 ? englishNumbers[index] : char;
      }).join('');
    };
    
    const persianDateWithEnglishNumbers = persianDate ? persianToEnglishNumbers(persianDate) : "";
    
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date,
      persianDateOfBirth: persianDateWithEnglishNumbers,
    }));

    // Clear validation error when user selects a date
    if (validationErrors.dateOfBirth) {
      setValidationErrors((prev) => ({
        ...prev,
        dateOfBirth: "",
      }));
    }
  };

  // Navigation functions
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      const mobileError = validateMobileNumber(formData.mobileNumber);
      const nationalIdError = validateNationalId(formData.nationalId);
      const dateError = validateDateOfBirth(formData.dateOfBirth);

      setValidationErrors({
        mobileNumber: mobileError,
        nationalId: nationalIdError,
        dateOfBirth: dateError,
      });

      // Only proceed if no validation errors
      if (!mobileError && !nationalIdError && !dateError) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2 && formData.frontPhoto && formData.backPhoto) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only handle submit for step 3
    if (currentStep !== 3 || !formData.recordedVideo) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log("Submitting data:", {
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        dateOfBirth: formData.persianDateOfBirth,
        hasFrontPhoto: !!formData.frontPhoto,
        hasBackPhoto: !!formData.backPhoto,
        hasVideo: !!formData.recordedVideo,
        hasSelfPhoto: !!formData.selfPhoto,
      });

      // Prepare data for API - format date in Persian format as expected by API
      const apiData: UserAuthorizationData = {
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        dateOfBirth: formData.persianDateOfBirth,
        persianDateOfBirth: formData.persianDateOfBirth,
        frontPhoto: formData.frontPhoto || "",
        backPhoto: formData.backPhoto || "",
        recordedVideo: formData.recordedVideo || "",
        selfPhoto: formData.selfPhoto || "",
      };

      console.log("Calling API with data:", apiData);

      // Call API
      const response = await submitUserAuthorization(apiData);

      console.log("API response:", response);

      if (response.success) {
        // Handle success - you can redirect or show success message
        console.log("Authorization submitted successfully:", response.data);
        // TODO: Redirect to success page or show success message
      } else {
        setSubmitError(response.message || "خطا در ارسال اطلاعات");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError("خطا در ارسال اطلاعات. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get camera display name
  const getCameraDisplayName = (camera: MediaDeviceInfo, index: number) => {
    if (camera.label) {
      return camera.label;
    }

    // Try to detect camera type based on label patterns
    const label = camera.label.toLowerCase();
    if (
      label.includes("front") ||
      label.includes("user") ||
      label.includes("selfie")
    ) {
      return "دوربین جلو";
    } else if (
      label.includes("back") ||
      label.includes("environment") ||
      label.includes("rear")
    ) {
      return "دوربین پشت";
    }

    // Fallback to numbered camera
    return `دوربین ${index + 1}`;
  };

  // Get current camera info
  const getCurrentCameraInfo = () => {
    if (!selectedCameraId) return null;
    return availableCameras.find((cam) => cam.deviceId === selectedCameraId);
  };

  // Switch to next camera
  const switchToNextCamera = () => {
    if (availableCameras.length <= 1) return;

    const currentIndex = availableCameras.findIndex(
      (cam) => cam.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];

    handleCameraChange(nextCamera.deviceId);
  };

  const renderStep1 = () => (
    <>
      {/* Header */}
      <div className="mb-8 text-right">
        <h1 className="mb-2 text-2xl font-bold text-right text-gray-800">
          احراز هویت
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          برای ثبت اظهارنامه، ابتدا باید احراز هویت انجام دهید
        </p>
        <div className="w-full h-px mx-auto bg-gray-300"></div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Mobile Number Field */}
        <div>
          <label
            htmlFor="mobileNumber"
            className="block mb-2 text-sm font-medium text-right text-gray-700"
          >
            شماره همراه
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 text-right border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.mobileNumber
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="شماره همراه خود را وارد کنید"
            dir="rtl"
          />
          {validationErrors.mobileNumber && (
            <p className="mt-1 text-sm text-right text-red-600">
              {validationErrors.mobileNumber}
            </p>
          )}
        </div>

        {/* National ID Field */}
        <div>
          <label
            htmlFor="nationalId"
            className="block mb-2 text-sm font-medium text-right text-gray-700"
          >
            کدملی
          </label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 text-right border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.nationalId ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="کد ملی خود را وارد کنید"
            dir="rtl"
          />
          {validationErrors.nationalId && (
            <p className="mt-1 text-sm text-right text-red-600">
              {validationErrors.nationalId}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block mb-2 text-sm font-medium text-right text-gray-700"
          >
            تاریخ تولد
          </label>
          <div
            className={`relative border rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.dateOfBirth
                ? "border-red-500"
                : "border-gray-200"
            }`}
          >
            <div className="w-full *:w-full">
              <DatePicker
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                className="w-full"
                inputClass="w-full px-4 py-3 !bg-transparent text-right"
                placeholder="روز، ماه، سال"
                format="YYYY/MM/DD"
                maxDate={new Date()}
                minDate={new Date(1900, 0, 1)}
              />
           
            </div>
            <div className="absolute transform -translate-y-1/2 pointer-events-none left-3 top-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {validationErrors.dateOfBirth && (
            <p className="mt-1 text-sm text-right text-red-600">
              {validationErrors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNextStep}
          disabled={
            !formData.mobileNumber ||
            !formData.nationalId ||
            !formData.dateOfBirth
          }
          className="w-full px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ادامه
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Header */}
      <div className="mb-8 text-right">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start justify-between gap-0">
            <h1 className="mb-2 text-2xl font-bold text-right text-gray-800">
              ارسال تصویر کارت ملی
            </h1>
            <p className="mb-4 text-sm text-gray-600">
              لطفا عکس پشت و رو کارت ملی خود را با دوربین بگیرید
            </p>
          </div>
          <button
            onClick={handlePrevStep}
            className="mb-4 text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
      </div>

      {/* Photo Upload Form */}
      <div className="space-y-6">
        {/* Front Photo Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-right text-gray-700">
            عکس روی کارت
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => startCamera("front")}
              disabled={isCameraLoading}
              className="block w-full h-32 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center h-full">
                {formData.frontPhoto ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.frontPhoto}
                      alt="عکس روی کارت"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                ) : isCameraLoading ? (
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 mb-2 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-600">
                      در حال بارگذاری دوربین...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      برای عکس گرفتن کلیک کنید
                    </p>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Camera Info Display */}
          {availableCameras.length > 1 && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400">
                برای تغییر دوربین، روی آیکن 🔄 کلیک کنید
              </p>
            </div>
          )}
        </div>

        {/* Back Photo Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-right text-gray-700">
            عکس پشت
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => startCamera("back")}
              disabled={isCameraLoading}
              className="block w-full h-32 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center h-full">
                {formData.backPhoto ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.backPhoto}
                      alt="عکس پشت کارت"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                ) : isCameraLoading ? (
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 mb-2 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-600">
                      در حال بارگذاری دوربین...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                      برای عکس گرفتن کلیک کنید
                    </p>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Camera Info Display */}
          {availableCameras.length > 1 && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400">
                برای تغییر دوربین، روی آیکن 🔄 کلیک کنید
              </p>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!formData.frontPhoto || !formData.backPhoto}
          className="w-full px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ادامه
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="mb-8 text-right">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start justify-between gap-0">
            <h1 className="mb-2 text-2xl font-bold text-right text-gray-800">
              ضبط ویدیو احراز هویت
            </h1>
            <p className="mb-4 text-sm text-gray-600">
              لطفا رو به روی دوربین بایستید و صورت خود را به سمت راست و چپ
              بچرخانید
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrevStep}
            className="mb-4 text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        {/* Face Detection Instructions */}
        <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-700">
              <strong>راهنمای احراز هویت با تشخیص چهره:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>
                  • بعد از باز کردن دوربین، سیستم به طور خودکار چهره شما را
                  تشخیص می‌دهد
                </li>
                <li>
                  • مطمئن شوید که صورتتان در مرکز دوربین قرار دارد (دایره سبز)
                </li>
                <li>• نور کافی داشته باشید و رو به روی دوربین بایستید</li>
                <li>
                  • برای تکمیل احراز هویت، مراحل زیر را انجام دهید:
                </li>
                <li className="mr-4">1️⃣ ابتدا صورت خود را در مرکز قرار دهید</li>
                <li className="mr-4">2️⃣ سر خود را به سمت چپ بچرخانید (حداقل 12 درجه)</li>
                <li className="mr-4">3️⃣ سر خود را به سمت راست بچرخانید (حداقل 12 درجه)</li>
                <li className="mr-4">4️⃣ صورت خود را دوباره در مرکز قرار دهید</li>
                <li>
                  • سیستم پیشرفت شما را نمایش می‌دهد و پس از تکمیل اطلاع می‌دهد
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Face Detection Status */}
        {!isFaceDetectionReady && (
          <div className="p-3 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <svg
                className="w-5 h-5 text-yellow-600 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm text-yellow-700">
                در حال بارگذاری مدل تشخیص چهره face-api.js...
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
      </div>

      {/* Video Recording Section */}
      <div className="space-y-6">
        {!formData.recordedVideo ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">
              شروع ضبط ویدیو
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              برای شروع ضبط ویدیو، روی دکمه زیر کلیک کنید
            </p>
            <button
              type="button"
              onClick={() => {
                setHeadRotationProgress({
                  center: false,
                  left: false,
                  right: false,
                });
                setHeadRotationStep("center");

                startCamera("front");
              }}
              disabled={!isFaceDetectionReady || isCameraLoading}
              className={`px-8 py-3 text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isFaceDetectionReady && !isCameraLoading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isCameraLoading
                ? "در حال بارگذاری دوربین..."
                : isFaceDetectionReady
                ? "شروع ضبط ویدیو"
                : "در حال بارگذاری..."}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <video
                src={formData.recordedVideo}
                controls
                className="w-full h-48 rounded-lg"
                autoPlay
                muted
              />
            </div>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, recordedVideo: null }));
                  resetRecording();
                  setHeadRotationProgress({
                    center: false,
                    left: false,
                    right: false,
                  });
                  setHeadRotationStep("center");
                }}
                className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ضبط مجدد
              </button>
              <button
                type="button"
                onClick={() => {
                  startCamera("front");
                  setHeadRotationStep("center");

                  setHeadRotationProgress({
                    center: false,
                    left: false,
                    right: false,
                  });
                }}
                className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                ویرایش ویدیو
              </button>
            </div>
          </div>
        )}

        {/* Submit Error Display */}
        {submitError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.recordedVideo || isSubmitting}
          className="w-full px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ارسال..." : "ارسال نهایی"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-Storm-Gray-50 ">
      <div className="w-[632px] relative bg-white shadow-md rounded-lg border border-gray-200 lg:p-32 p-2 py-16">
        <div className="w-full max-w-md">
          {currentStep === 1
            ? renderStep1()
            : currentStep === 2
            ? renderStep2()
            : renderStep3()}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <div className="mb-4 text-right">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentStep === 3
                  ? "ضبط ویدیو احراز هویت"
                  : showCamera === "front"
                  ? "عکس روی کارت"
                  : "عکس پشت کارت"}
              </h3>
              <p className="text-sm text-gray-500">
                {isRecording ? "در حال ضبط ویدیو..." : "دوربین فعال است"}
              </p>
            </div>

            <div className="relative">
              {/* Camera Loading Indicator */}
              {isCameraLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white rounded-lg bg-opacity-90">
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 mb-2 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-600">
                      در حال بارگذاری دوربین...
                    </p>
                  </div>
                </div>
              )}

              {/* Recording Timer */}
              {isRecording && (
                <div className="absolute z-10 px-3 py-1 text-sm text-white bg-black rounded-full top-2 left-2 bg-opacity-70">
                  {Math.floor(recordingTime / 60)}:
                  {(recordingTime % 60).toString().padStart(2, "0")}
                </div>
              )}

              {/* Recording Progress Bar */}
              {isRecording && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full transition-all duration-1000 bg-blue-500"
                    style={{ width: `${recordingProgress}%` }}
                  />
                </div>
              )}

              {/* Face Position Circle for Step 3 */}
              {currentStep === 3 && isRecording && (
                <div className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 pointer-events-none left-1/2 -top-5">
                  {/* Status Message */}
                  <div
                    className={`px-4 py-2 mb-4 rounded-lg text-white font-bold shadow-lg ${
                      faceInCenter ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {faceInCenter
                      ? "✅ چهره در مرکز است"
                      : "❌ چهره خارج از مرکز"}
                  </div>

                  {/* Simple Circle Indicator */}
                  <div
                    className={`w-32 h-32 border-4 rounded-full transition-all duration-300 shadow-2xl ${
                      faceInCenter
                        ? "border-green-500 bg-green-500 bg-opacity-20"
                        : "border-red-500 bg-red-500 bg-opacity-20"
                    }`}
                  />
                </div>
              )}

              {/* Head Rotation Progress - Below Camera */}
              {headRotationStep === "complete" ? (
                <div className="absolute z-20 -translate-x-1/2 pointer-events-none -bottom-10 left-1/2">
                  <div className="px-4 py-3 text-center text-white bg-black rounded-lg bg-opacity-80">
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <div
                        className={`flex flex-col items-center space-y-1 ${
                          headRotationProgress.center
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <span className="text-xs text-nowrap ">
                          میتوانید ضبط ویدیو را خاتمه دهید
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                currentStep === 3 &&
                isRecording && (
                  <div className="absolute z-20 -translate-x-1/2 pointer-events-none -bottom-10 left-1/2">
                    <div className="px-4 py-3 text-center text-white bg-black rounded-lg bg-opacity-80">
                      <div className="flex items-center justify-center space-x-4 space-x-reverse">
                        <div
                          className={`flex flex-col items-center space-y-1 ${
                            headRotationProgress.center
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-lg">
                            {headRotationProgress.center ? "✅" : "⭕"}
                          </span>
                          <span className="text-xs">مرکز</span>
                        </div>
                        <div
                          className={`flex flex-col items-center space-y-1 ${
                            headRotationProgress.left
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-lg">
                            {headRotationProgress.left ? "✅" : "⭕"}
                          </span>
                          <span className="text-xs">چپ</span>
                        </div>
                        <div
                          className={`flex flex-col items-center space-y-1 ${
                            headRotationProgress.right
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-lg">
                            {headRotationProgress.right ? "✅" : "⭕"}
                          </span>
                          <span className="text-xs">راست</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  width={640}
                  height={480}
                  videoConstraints={getVideoConstraintsWithDevice(
                    showCamera,
                    selectedCameraId
                  )}
                  onUserMediaError={handleUserMediaError}
                  screenshotFormat="image/jpeg"
                  className="object-cover w-full h-64 rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 w-full h-full ${
                    currentStep === 3 ? "block" : "hidden"
                  }`}
                  style={{ pointerEvents: "none" }}
                />
                {/* Camera Switch Icon */}
                {availableCameras.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      switchToNextCamera();
                    }}
                    className="absolute p-2 transition-all bg-white rounded-full shadow-md top-2 left-2 bg-opacity-80 hover:bg-opacity-100"
                    title={`تغییر دوربین (فعلی: ${getCameraDisplayName(
                      getCurrentCameraInfo()!,
                      availableCameras.findIndex(
                        (cam) => cam.deviceId === selectedCameraId
                      )
                    )})`}
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 rounded-lg bg-opacity-90">
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 bg-red-200 rounded-full">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700">{cameraError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-4 space-x-4 space-x-reverse">
              {!isRecording ? (
                <>
                  {currentStep !== 3 && (
                    <button
                      onClick={capturePhoto}
                      className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      عکس بگیر
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      onClick={startVideoRecording}
                      className="px-6 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      شروع ضبط
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={stopVideoRecording}
                  className="px-6 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-600"
                >
                  توقف ضبط
                </button>
              )}
              <button
                onClick={stopCamera}
                className="px-6 py-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAuthorization;
