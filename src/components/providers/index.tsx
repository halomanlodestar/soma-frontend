/** @format */

import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "../ui/tooltip";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ApolloAppProvider } from "@/lib/apollo-provider";

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
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </ApolloAppProvider>
  );
};

export default Providers;
