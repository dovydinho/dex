export default function Button({ children, className, ...rest }) {
  return (
    <button
      {...rest}
      className={`border py-4 rounded-2xl uppercase font-bold duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
