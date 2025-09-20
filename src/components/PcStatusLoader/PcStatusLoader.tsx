import styles from "./PcStatusLoader.module.css";

type PcStatusLoaderProps = {
  message?: string;
  subtitle?: string;
  show?: boolean;
};
export default function PcStatusLoader({
  message,
  subtitle,
  show = true,
}: PcStatusLoaderProps) {
  if (!show) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}>
        <div className={styles.circle}></div>
        <div className={styles.glow}></div>
      </div>
      <h2 className={styles.title}>{message}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
