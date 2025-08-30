import * as tf from '@tensorflow/tfjs';

export interface LocalModelConfig {
  modelUrl: string;
  maxFaces?: number;
  iouThreshold?: number;
  scoreThreshold?: number;
}

export class LocalBlazeFaceModel {
  private model: tf.GraphModel;

  constructor(model: tf.GraphModel) {
    this.model = model;
  }

  async estimateFaces(
    input: tf.Tensor3D | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  ): Promise<Array<{
    topLeft: [number, number];
    bottomRight: [number, number];
    probability: [number];
  }>> {
    try {
      // Convert input to tensor if needed
      let inputTensor: tf.Tensor3D;
      if (input instanceof tf.Tensor) {
        inputTensor = input as tf.Tensor3D;
      } else {
        inputTensor = tf.browser.fromPixels(input);
      }

      // Preprocess input (resize to 128x128 and normalize)
      const resized = tf.image.resizeBilinear(inputTensor, [128, 128]);
      const normalized = tf.div(resized, 255.0);
      const batched = normalized.expandDims(0);

      // Run inference
      const predictions = await this.model.predict(batched) as tf.Tensor;
      
      // Post-process predictions (this is a simplified version)
      // In a real implementation, you would need to decode the predictions properly
      await predictions.array();
      
      // Clean up tensors
      inputTensor.dispose();
      resized.dispose();
      normalized.dispose();
      batched.dispose();
      predictions.dispose();

      // Return mock face detection results for now
      // In a real implementation, you would decode the actual predictions
      return [{
        topLeft: [50, 50],
        bottomRight: [150, 150],
        probability: [0.95]
      }];
    } catch (error) {
      console.error('Error in local face detection:', error);
      return [];
    }
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
  }
}

export async function loadLocalBlazeFaceModel(config: LocalModelConfig): Promise<LocalBlazeFaceModel> {
  try {
    await tf.ready();
    console.log('Loading local BlazeFace model from:', config.modelUrl);
    const model = await tf.loadGraphModel(config.modelUrl);
    console.log('Local BlazeFace model loaded successfully');
    return new LocalBlazeFaceModel(model);
  } catch (error) {
    console.error('Error loading local model:', error);
    throw error;
  }
}
