import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-hand text-5xl text-wine">404</p>
      <h1 className="mt-3 font-serif text-3xl">Esta página não está no livro.</h1>
      <Link to="/" className="mt-6 inline-block font-sans text-sm text-wine underline">
        Voltar ao início
      </Link>
    </div>
  );
}
