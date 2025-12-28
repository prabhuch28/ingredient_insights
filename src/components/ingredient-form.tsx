'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Sparkles, Camera, Upload, SwitchCamera } from 'lucide-react';
import { LoadingAnimation } from './loading-animation';
import { Logo } from './icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

export function IngredientForm({
  formAction,
}: {
  formAction: (payload: FormData) => void;
}) {
  const { pending } = useFormStatus();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isCapturing) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description:
              'Please enable camera permissions in your browser settings.',
          });
          setIsCapturing(false);
        }
      };

      getCameraPermission();

      return () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [isCapturing, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/png');
        setImagePreview(dataUri);
        
        // Convert data URI to file and set it in the form
        fetch(dataUri)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "capture.png", { type: "image/png" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRef.current) {
              fileInputRef.current.files = dataTransfer.files;
            }
          });
      }
      setIsCapturing(false);
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  if (pending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-center animate-in fade-in-50 duration-500">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-16 w-16 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-400">
          Ingredient Insights AI
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 max-w-md">
          Paste an ingredient list or snap a photo to understand what you're really eating.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="image">Image Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-4">
                <Textarea
                  name="ingredients"
                  placeholder="e.g. Enriched flour, high fructose corn syrup, palm oil, salt, artificial flavors..."
                  className="min-h-[150px] w-full rounded-xl bg-transparent p-0 text-base backdrop-blur-sm focus:ring-0 focus:outline-none border-0"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="image">
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-4 space-y-4">
                {isCapturing ? (
                   <div className="space-y-4">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                     <div className="flex justify-center gap-4">
                        <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="mr-2" /> Capture
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsCapturing(false)}>
                            Cancel
                        </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card/50 border-primary/30 hover:bg-card/80"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Image preview"
                            className="object-contain h-full w-full rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-neutral-400" />
                            <p className="mb-2 text-sm text-neutral-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-neutral-500">PNG, JPG, or WEBP</p>
                          </div>
                        )}
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <Button type="button" onClick={() => setIsCapturing(true)} className="w-full">
                      <Camera className="mr-2" />
                      Use Camera
                    </Button>
                  </>
                )}
                 <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto bg-accent text-accent-foreground font-bold hover:bg-accent/90 hover:shadow-glow-accent transition-all duration-300"
          disabled={pending}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze Ingredients
        </Button>
      </form>
    </div>
  );
}
