import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Post no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, no pudimos encontrar el artículo que buscas. Puede que
            haya sido movido o ya no exista.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center w-full justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/blog/personal"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Blog Personal
            </Link>
            <Link
              href="/blog/electric-automatic"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 text-green-600 border border-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Electric Automatic
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si llegaste aquí desde un enlace, por favor{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              contáctanos
            </Link>{" "}
            para reportar el problema.
          </p>
        </div>
      </div>
    </div>
  );
}
