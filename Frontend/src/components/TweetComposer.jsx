export default function TweetComposer({ value, onChange, onSubmit, loading }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="p-4 border-b border-white/10"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="¿Qué está pasando?"
          className="w-full bg-transparent resize-none outline-none"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Postear"}
          </button>
        </div>
      </form>
    );
  }
  