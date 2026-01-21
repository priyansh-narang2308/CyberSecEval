import { useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import { Code, ArrowRight, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const EncodingPage = () => {
  const [inputText, setInputText] = useState('SecureExamVault');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');

  const handleEncode = () => {
    try {
      setEncoded(btoa(inputText));
      setDecoded('');
    } catch (e) {
      setEncoded('Error: Invalid characters');
    }
  };

  const handleDecode = () => {
    try {
      setDecoded(atob(encoded));
    } catch (e) {
      setDecoded('Error: Invalid Base64 string');
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Encoding Demonstration</h1>
          <p className="text-muted-foreground">
            Understanding the difference between encoding and encryption.
          </p>
        </div>

        {/* Warning */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Important Distinction</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Encoding is NOT encryption.</strong> Encoding transforms data into a different format
                for safe transmission, but it provides no security. Anyone can decode encoded data without
                any key or password.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Base64 Encoding Demo</h2>

          <div className="space-y-6">
            {/* Input */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Input Text</label>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to encode"
                className="max-w-md"
              />
            </div>

            {/* Encode Button */}
            <Button onClick={handleEncode} variant="security">
              <Code className="h-4 w-4" />
              Encode to Base64
            </Button>

            {/* Encoded Output */}
            {encoded && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Encoded Output (Base64)</label>
                <div className="p-4 rounded-lg bg-muted border">
                  <code className="text-sm font-mono text-foreground break-all">{encoded}</code>
                </div>
              </div>
            )}

            {/* Decode Button */}
            {encoded && !encoded.startsWith('Error') && (
              <Button onClick={handleDecode} variant="outline">
                <ArrowRight className="h-4 w-4" />
                Decode Back
              </Button>
            )}

            {/* Decoded Output */}
            {decoded && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Decoded Output</label>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <code className="text-sm font-mono text-foreground">{decoded}</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Encoding vs Encryption</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Aspect</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Encoding</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Encryption</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Purpose</td>
                  <td className="py-3 px-4 text-foreground">Data representation</td>
                  <td className="py-3 px-4 text-foreground">Data protection</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Key Required</td>
                  <td className="py-3 px-4 text-foreground">No</td>
                  <td className="py-3 px-4 text-foreground">Yes</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Reversible By</td>
                  <td className="py-3 px-4 text-foreground">Anyone</td>
                  <td className="py-3 px-4 text-foreground">Key holder only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">Example</td>
                  <td className="py-3 px-4 text-foreground">Base64, URL encoding</td>
                  <td className="py-3 px-4 text-foreground">AES, RSA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="p-4 rounded-lg bg-muted border">
          <h3 className="font-medium text-foreground mb-2">When We Use Encoding</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Transmitting binary data over text-based protocols (email attachments)</li>
            <li>• URL parameters that contain special characters</li>
            <li>• Storing binary data in JSON or XML formats</li>
            <li>• Data interchange between different systems</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EncodingPage;
