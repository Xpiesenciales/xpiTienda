'use client';

import { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  username?: string;
  email: string;
  rol?: string;
  createdAt: string;
}

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [vista, setVista] = useState<'lista' | 'registro' | 'login'>('lista');
  const [cargandoInicial, setCargandoInicial] = useState(true);

  const cargarUsuarios = async () => {
    try {
      setCargandoInicial(true);
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      
      if (data.success && data.usuarios) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargandoInicial(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje({ tipo: 'success', texto: '¡Usuario registrado!' });
        setNombre('');
        setUsername('');
        setEmail('');
        setPassword('');
        await cargarUsuarios();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <header className="bg-white/10 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">🚀 XPI Tienda</h1>
            <nav className="flex gap-4">
              <button onClick={() => setVista('lista')} className={`px-4 py-2 rounded-lg transition ${vista === 'lista' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}`}>Usuarios</button>
              <button onClick={() => setVista('registro')} className={`px-4 py-2 rounded-lg transition ${vista === 'registro' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}`}>Registro</button>
              <button onClick={() => setVista('login')} className={`px-4 py-2 rounded-lg transition ${vista === 'login' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}`}>Login</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg shadow-lg ${mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>{mensaje.texto}</div>
        )}

        {vista === 'lista' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Usuarios Registrados</h2>
            
            {cargandoInicial ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Cargando...</p>
              </div>
            ) : usuarios.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <th className="p-3 text-left rounded-tl-lg">ID</th>
                      <th className="p-3 text-left">Nombre</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Rol</th>
                      <th className="p-3 text-left rounded-tr-lg">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-purple-50 transition">
                        <td className="p-3 font-medium text-gray-700">#{u.id}</td>
                        <td className="p-3 text-gray-800">{u.nombre}</td>
                        <td className="p-3">
                          {u.username ? (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">@{u.username}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{u.email}</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {u.rol || 'CLIENTE'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay usuarios registrados.</p>
            )}
          </div>
        )}

        {vista === 'registro' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Registrar Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Juan Pérez" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="@juanperez" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="juan@email.com" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="••••••••" required minLength={6} />
              </div>
              <button type="submit" disabled={cargando} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50">
                {cargando ? 'Registrando...' : '🎉 Registrar'}
              </button>
            </form>
          </div>
        )}

        {vista === 'login' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔐 Iniciar Sesión</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username o Email</label>
                <input type="text" className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="@usuario" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
                <input type="password" className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold">🚀 Ingresar</button>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-white/10 backdrop-blur-md mt-12 py-6">
        <div className="text-center text-white">© 2024 XPI Tienda</div>
      </footer>
    </div>
  );
}