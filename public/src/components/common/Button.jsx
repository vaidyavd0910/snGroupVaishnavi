import React from "react";
import { motion as m } from "framer-motion";

const variants = {
  primary: "bg-primary text-white hover:bg-opacity-90",
  secondary: "bg-secondary text-white hover:bg-opacity-90",
  outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
  accent: "bg-accent text-richBlack hover:bg-opacity-90",
};

const sizes = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-4 px-8 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) => {
  return (
    <m.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? "w-full" : ""} 
        rounded-lg font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </m.button>
  );
};

export default Button; 