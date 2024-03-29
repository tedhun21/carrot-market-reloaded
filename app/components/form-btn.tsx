interface FomrButtonProps {
  loading: boolean;
  text: string;
}

export default function FormButton({ loading, text }: FomrButtonProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
