import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'main' | 'section';
}

/**
 * Standard reusable content page container across PyInterview Pro.
 * Reusable component note: Matches the unified 1700px maximum width used by
 * ProblemArena and AlgoPatternsView for seamless visual alignment across all views.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`max-w-[1700px] w-full mx-auto ${className}`}>
      {children}
    </Component>
  );
};
