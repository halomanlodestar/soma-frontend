/** @format */

import { ThemeProvider } from "../theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import { ReactQueryProvider } from "./ReactQueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
