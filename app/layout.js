import Navbar from "@/components/Navbar";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export const metadata = {
  title: "AI TODO (OpenRouter + CopilotKit)",
  description: "Next.js TODO app controlled by an AI copilot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Point the provider to our API route */}
        <Navbar/>
        <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
      </body>
    </html>
  );
}
