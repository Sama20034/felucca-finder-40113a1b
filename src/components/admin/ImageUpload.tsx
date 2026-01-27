import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// رابط سيرفر الرفع على Hostinger
const UPLOAD_URL = 'https://reselience-gold.com/upload.php';

interface ImageUploadProps {
  bucket?: string;
  folder?: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  compact?: boolean;
}

const ImageUpload = ({ 
  bucket, 
  folder = '', 
  currentImageUrl, 
  onImageUploaded,
  label = 'الصورة',
  compact = false
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار صورة فقط',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من حجم الملف (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'خطأ',
        description: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      // رفع الملف إلى Hostinger
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.success && result.url) {
        setPreview(result.url);
        onImageUploaded(result.url);

        toast({
          title: 'نجاح',
          description: 'تم رفع الصورة بنجاح',
        });
      } else {
        throw new Error('فشل في رفع الصورة');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء رفع الصورة',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Compact mode for additional images grid
  if (compact) {
    return (
      <div className="relative">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-compact-${bucket}-${Date.now()}`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">إضافة</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${bucket}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'جاري الرفع...' : 'اختر صورة'}
          </Button>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP حتى 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
