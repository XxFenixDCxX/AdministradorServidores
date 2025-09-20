import { useEffect } from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number; // ms
  onClose: () => void;
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
}
