export default function Button({ children, className, ...rest }) {
  return (
    <button
      {...rest}
      className={`border rounded-full font-bold transition py-4 ${className}`}
    >
      {children}
    </button>
  );
}
