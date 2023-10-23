import { FC } from "react";

interface ErrorProps {
  code: number;
}

export const Error: FC<ErrorProps> = ({ code }) => {
  return <div className="error-container">error page {code}</div>;
};
