import React, { useState, useEffect } from 'react';

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined;
  height: number | undefined;
}

const viewportContext = React.createContext<Size>({
  width: undefined,
  height: undefined,
});

export const ViewportProvider = ({ children }: any) => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  /* Now we are dealing with a context instead of a Hook, so instead
     of returning the width and height we store the values in the
     value of the Provider */
  return (
    <viewportContext.Provider value={windowSize}>
      {children}
    </viewportContext.Provider>
  );
};

/* Rewrite the "useWindowSize" hook to pull the width and height values
   out of the context instead of calculating them itself */
export const useWindowSize = (): Size => {
  /* We can use the "useContext" Hook to access a context from within
     another Hook, remember, Hooks are composable! */
  const windowSize = React.useContext(viewportContext);
  return windowSize;
};
