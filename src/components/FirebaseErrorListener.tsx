'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Global Error Bridge Component
 * * This invisible component mounts at the top level of the application to bridge
 * asynchronous events (specifically Firebase permission errors) into React's 
 * Error Boundary lifecycle.
 * * It listens for 'permission-error' events and re-throws them during the render phase,
 * allowing next.js 'global-error.tsx' or 'error.tsx' to catch and display the proper UI.
 */
export function FirebaseErrorListener() {
  // We strictly type the state to ensure we only catch expected error types
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (incomingError: FirestorePermissionError) => {
      // Trigger a state update to force a re-render
      setError(incomingError);
    };

    // Subscribe to the global error emitter
    errorEmitter.on('permission-error', handleError);

    // Cleanup subscription on unmount to prevent memory leaks
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // If an error was captured from the event listener, throw it immediately.
  // This allows the nearest React Error Boundary to catch it.
  if (error) {
    throw error;
  }

  // This component is functional logic only and renders no UI.
  return null;
}
