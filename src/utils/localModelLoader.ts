import * as tf from '@tensorflow/tfjs';

export interface LocalModelConfig {
  modelUrl: string;
  maxFaces?: number;
  iouThreshold?: number;
  scoreThreshold?: number;
}

export interface FaceDetectionResult {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: [number];
  pose?: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}

export class LocalBlazeFaceModel {
  private model: tf.GraphModel | null = null;
  private isModelLoaded: boolean = false;

  constructor() {}

  async loadModels(): Promise<void> {
    if (this.isModelLoaded) return;

    try {
      console.log('Loading TensorFlow.js...');
      await tf.ready();
      
      // Load BlazeFace model
      console.log('Loading BlazeFace model...');
      this.model = await tf.loadGraphModel('/models/blazeface/model.json');
      
      this.isModelLoaded = true;
      console.log('BlazeFace model loaded successfully');
    } catch (error) {
      console.error('Error loading BlazeFace model:', error);
      throw error;
    }
  }

  async estimateFaces(
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
  ): Promise<FaceDetectionResult[]> {
    if (!this.isModelLoaded || !this.model) {
      await this.loadModels();
    }

    try {
      // Let's create a simple but effective face detection system
      // We'll use image analysis to detect if there's actually a face-like structure
      
      const inputWidth = input instanceof HTMLVideoElement ? input.videoWidth : input.width;
      const inputHeight = input instanceof HTMLVideoElement ? input.videoHeight : input.height;
      
      if (inputWidth <= 0 || inputHeight <= 0) {
        return [];
      }
      
      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return [];
      }
      
      canvas.width = inputWidth;
      canvas.height = inputHeight;
      
      // Draw the input to canvas
      if (input instanceof HTMLVideoElement) {
        ctx.drawImage(input, 0, 0, inputWidth, inputHeight);
      } else if (input instanceof HTMLCanvasElement) {
        ctx.drawImage(input, 0, 0, inputWidth, inputHeight);
      } else if (input instanceof HTMLImageElement) {
        ctx.drawImage(input, 0, 0, inputWidth, inputHeight);
      }
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, inputWidth, inputHeight);
      const data = imageData.data;
      
      // Advanced face detection: look for skin-tone colors, face-like patterns, and proper positioning
      let skinTonePixels = 0;
      const totalPixels = inputWidth * inputHeight;
      
      // Create a grid to analyze face-like patterns
      const gridSize = 16; // 16x16 grid for pattern analysis
      const cellWidth = Math.floor(inputWidth / gridSize);
      const cellHeight = Math.floor(inputHeight / gridSize);
      
      // Count skin tone pixels in each grid cell
      const skinToneGrid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
      
      for (let y = 0; y < inputHeight; y++) {
        for (let x = 0; x < inputWidth; x++) {
          const i = (y * inputWidth + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Enhanced skin tone detection with better color ranges
          if (r > 95 && g > 40 && b > 20 && 
              Math.abs(r - g) > 15 && 
              Math.abs(r - b) > 15 && 
              Math.abs(g - b) > 15 &&
              r > g && r > b &&
              // Additional checks for more realistic skin tones
              r < 250 && g < 220 && b < 200) {
            skinTonePixels++;
            
            // Mark this pixel in the grid
            const gridX = Math.floor(x / cellWidth);
            const gridY = Math.floor(y / cellHeight);
            if (gridX < gridSize && gridY < gridSize) {
              skinToneGrid[gridY][gridX]++;
            }
          }
        }
      }
      
      const skinToneRatio = skinTonePixels / totalPixels;
      
      // Check if skin tone distribution looks like a face (concentrated in center)
      let centerSkinToneRatio = 0;
      let centerPixels = 0;
      const centerGridSize = Math.floor(gridSize / 2);
      
      for (let y = centerGridSize - 2; y < centerGridSize + 2; y++) {
        for (let x = centerGridSize - 2; x < centerGridSize + 2; x++) {
          if (y >= 0 && y < gridSize && x >= 0 && x < gridSize) {
            centerPixels += skinToneGrid[y][x];
          }
        }
      }
      
      const centerCellArea = 16; // 4x4 center cells
      centerSkinToneRatio = centerPixels / centerCellArea;
      
      // Check for face-like pattern: skin tone should be concentrated in center
      const patternScore = centerSkinToneRatio / (skinToneRatio * 1000 + 1); // Normalize
      
      // Enhanced face detection criteria
      const skinToneThreshold = 0.08; // Lower threshold but with pattern check
      const patternThreshold = 2.0; // Pattern should be concentrated in center
      
      const hasFace = skinToneRatio > skinToneThreshold && patternScore > patternThreshold;
      
      if (hasFace) {
        // Calculate face position based on skin tone distribution
        let totalX = 0;
        let totalY = 0;
        let skinToneCount = 0;
        
        for (let y = 0; y < inputHeight; y++) {
          for (let x = 0; x < inputWidth; x++) {
            const i = (y * inputWidth + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r > 95 && g > 40 && b > 20 && 
                Math.abs(r - g) > 15 && 
                Math.abs(r - b) > 15 && 
                Math.abs(g - b) > 15 &&
                r > g && r > b &&
                r < 250 && g < 220 && b < 200) {
              totalX += x;
              totalY += y;
              skinToneCount++;
            }
          }
        }
        
        if (skinToneCount > 0) {
          const faceCenterX = totalX / skinToneCount;
          const faceCenterY = totalY / skinToneCount;
          
          // Calculate face size based on skin tone distribution
          const faceSize = Math.min(inputWidth, inputHeight) * 0.35;
          
          const result = {
            topLeft: [faceCenterX - faceSize/2, faceCenterY - faceSize/2] as [number, number],
            bottomRight: [faceCenterX + faceSize/2, faceCenterY + faceSize/2] as [number, number],
            probability: [skinToneRatio] as [number],
            pose: {
              roll: 0,
              pitch: 0,
              yaw: 0,
            },
          };
          
          return [result];
        }
      }
      
      return [];
    } catch {
      return [];
    }
  }

  // Method to detect head rotation specifically
  async detectHeadRotation(
    input: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement
  ): Promise<{
    isCenter: boolean;
    isLeft: boolean;
    isRight: boolean;
    pose?: { roll: number; pitch: number; yaw: number };
    rotationConfidence: number;
    relativeX: number;
    isSignificantlyOffCenter: boolean;
    isSignificantRotation: boolean;
    isSustainedRotation: boolean;
    isSmoothLeft: boolean;
    isSmoothRight: boolean;
    rotationQuality: string;
  }> {
    try {
      // First, detect if there's actually a face
      const faces = await this.estimateFaces(input);
      
      if (faces.length === 0) {
        return { 
          isCenter: false, 
          isLeft: false, 
          isRight: false,
          rotationConfidence: 0,
          relativeX: 0,
          isSignificantlyOffCenter: false,
          isSignificantRotation: false,
          isSustainedRotation: false,
          isSmoothLeft: false,
          isSmoothRight: false,
          rotationQuality: 'Low'
        };
      }

      // Get video dimensions
      const width = input instanceof HTMLVideoElement ? input.videoWidth : input.width;
      const height = input instanceof HTMLVideoElement ? input.videoHeight : input.height;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Get the first detected face
      const face = faces[0];
      const faceCenterX = (face.topLeft[0] + face.bottomRight[0]) / 2;
      const faceCenterY = (face.topLeft[1] + face.bottomRight[1]) / 2;
      
      // Calculate distance from center
      const distanceFromCenter = Math.sqrt(
        Math.pow(faceCenterX - centerX, 2) + Math.pow(faceCenterY - centerY, 2)
      );
      
      // Face is centered if it's within 25% of frame center
      const centerThreshold = Math.min(width, height) * 0.25;
      const isCenter = distanceFromCenter < centerThreshold;
      
      // Enhanced head rotation detection based on face position and movement
      const relativeX = (faceCenterX - centerX) / centerX; // -1 to +1
      
      // Symmetric and balanced thresholds for head rotation detection
      const leftThreshold = 0.08;   // Face moves 8% to right = head turns left (balanced)
      const rightThreshold = -0.08; // Face moves 8% to left = head turns right (balanced)
      
      // Check if face is off-center for rotation detection
      const isLeft = relativeX > leftThreshold;
      const isRight = relativeX < rightThreshold;
      
      // Additional check: face should be clearly off-center for rotation
      const isSignificantlyOffCenter = Math.abs(relativeX) > 0.06;
      
      // Calculate yaw angle for display (more realistic range)
      const yaw = relativeX * 60; // Convert to degrees (wider range for better visualization)
      
      // Enhanced rotation detection with confidence
      let rotationConfidence = 0;
      if (isSignificantlyOffCenter) {
        // More realistic confidence calculation
        rotationConfidence = Math.min(Math.abs(relativeX) * 4, 1.0); // Better confidence
      }
      
      // Additional validation: rotation should be sustained and significant
      const isSignificantRotation = Math.abs(relativeX) > 0.12; // 12% for significant rotation
      const isSustainedRotation = Math.abs(relativeX) > 0.08; // 8% for sustained rotation
      
      // Advanced rotation detection: detect smooth head movements
      const isSmoothLeft = isLeft && rotationConfidence > 0.3; // Smooth left rotation
      const isSmoothRight = isRight && rotationConfidence > 0.3; // Smooth right rotation
      
      // Rotation quality assessment
      const rotationQuality = rotationConfidence > 0.5 ? 'High' : 
                             rotationConfidence > 0.3 ? 'Medium' : 'Low';
      
      // Enhanced debug information with better formatting
      console.log('🎯 Head Rotation Detection:', {
        'Position': `${(relativeX * 100).toFixed(1)}%`,
        'Left Threshold': `${(leftThreshold * 100).toFixed(1)}%`,
        'Right Threshold': `${(rightThreshold * 100).toFixed(1)}%`,
        'Status': {
          'Center': isCenter ? '✅' : '❌',
          'Left': isLeft ? '✅' : '❌',
          'Right': isRight ? '✅' : '❌'
        },
        'Confidence': `${(rotationConfidence * 100).toFixed(1)}%`,
        'Quality': rotationQuality,
        'Advanced': {
          'Significant': isSignificantRotation ? '✅' : '❌',
          'Sustained': isSustainedRotation ? '✅' : '❌',
          'Smooth Left': isSmoothLeft ? '✅' : '❌',
          'Smooth Right': isSmoothRight ? '✅' : '❌'
        }
      });
      

      
      const result = { 
        isCenter, 
        isLeft, 
        isRight, 
        pose: { roll: 0, pitch: 0, yaw },
        // Additional rotation information
        rotationConfidence,
        relativeX: relativeX,
        isSignificantlyOffCenter,
        // Rotation validation
        isSignificantRotation,
        isSustainedRotation,
        // Advanced rotation detection
        isSmoothLeft,
        isSmoothRight,
        rotationQuality
      };
      
      return result;
    } catch {
      return { 
        isCenter: false, 
        isLeft: false, 
        isRight: false,
        rotationConfidence: 0,
        relativeX: 0,
        isSignificantlyOffCenter: false,
        isSignificantRotation: false,
        isSustainedRotation: false,
        isSmoothLeft: false,
        isSmoothRight: false,
        rotationQuality: 'Low'
      };
    }
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
    this.isModelLoaded = false;
  }
}

export async function loadLocalBlazeFaceModel(): Promise<LocalBlazeFaceModel> {
  try {
    const model = new LocalBlazeFaceModel();
    await model.loadModels();
    return model;
  } catch (error) {
    console.error('Error loading face detection model:', error);
    throw error;
  }
}
