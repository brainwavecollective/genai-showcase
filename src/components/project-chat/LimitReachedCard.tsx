
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function LimitReachedCard() {
  return (
    <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">Daily Chat Limit Reached</h3>
          <p className="text-sm text-yellow-700 mt-1">
            The number of available free chats for today has been exhausted. 
            Please try again tomorrow or contact daniel@brainwavecollective.ai for assistance.
          </p>
        </div>
      </div>
    </Card>
  );
}
