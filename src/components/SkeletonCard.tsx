import styled, { keyframes } from "styled-components";

/**
 * Skeleton Card Component
 *
 * Displays a loading placeholder while Pokemon data is being fetched.
 * This provides immediate visual feedback to users and improves perceived performance.
 *
 * Design rationale:
 * - Matches the dimensions and layout of actual Pokemon cards
 * - Uses shimmer animation to indicate loading state
 * - Maintains grid layout consistency during loading
 */

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonCardContainer = styled.div`
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  background: white;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const SkeletonImage = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const SkeletonText = styled.div`
  width: 80px;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

/**
 * SkeletonCard component for loading state
 *
 * Usage:
 * ```tsx
 * <SkeletonCard />
 * ```
 */
export const SkeletonCard = () => {
  return (
    <SkeletonCardContainer role="status" aria-label="Loading Pokemon">
      <SkeletonImage />
      <SkeletonText />
    </SkeletonCardContainer>
  );
};

