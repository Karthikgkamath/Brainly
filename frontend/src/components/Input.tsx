interface InputProps {
  text: string;
  reference: React.RefObject<HTMLInputElement | null>;
}

export function Input({ text, reference }: InputProps) {
  return (
    <input
      ref={reference}
      type="text"
      placeholder={text}
      className="border rounded-md px-4 py-2"
    />
  );
}