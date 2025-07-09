export interface UploadImage {
  image: string;
  folder: string;
}

export interface GenerateURLDTO {
  folder: string;
  publicId: string;
  timestamp:number
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  publicId:string
  cloudName: string;
  folder:string
}
