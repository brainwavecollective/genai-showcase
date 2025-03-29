
import { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  as?: 'input' | 'textarea';
  rows?: number; // Added rows property for textareas
}

const FormField = ({ 
  label, 
  name, 
  error, 
  required, 
  as = 'input',
  rows = 3, // Default value for rows
  ...props 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {as === 'input' ? (
        <Input
          id={name}
          name={name}
          className={error ? "border-red-500" : ""}
          {...props as InputHTMLAttributes<HTMLInputElement>}
        />
      ) : (
        <Textarea
          id={name}
          name={name}
          className={error ? "border-red-500" : ""}
          rows={rows}
          {...props as InputHTMLAttributes<HTMLTextAreaElement>}
        />
      )}
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
