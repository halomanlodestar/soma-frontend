/** @format */

import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ApolloAppProvider } from "@/lib/apollo-provider";
import { AuthPromptProvider } from "@/components/providers/AuthPromptProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloAppProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AuthPromptProvider>{children}</AuthPromptProvider>
          </TooltipProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </ApolloAppProvider>
  );
};

export default Providers;
