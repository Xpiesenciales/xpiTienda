'use client';

import { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      if (data.success && data.usuarios) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => { 
    cargarUsuarios(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
      });
      setNombre('');
      setEmail('');
      cargarUsuarios();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input 
            type="text" 
            placeholder="Nombre" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
          <button 
            type="submit" 
            disabled={cargando} 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {cargando ? 'Guardando...' : 'Agregar Usuario'}
          </button>
        </form>
        
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Usuarios Registrados</h2>
          {!usuarios || usuarios.length === 0 ? (
            <p className="text-gray-500">No hay usuarios aún.</p>
          ) : (
            usuarios.map((u) => (
              <div key={u.id} className="p-3 border rounded flex justify-between">
                <span className="font-medium">{u.nombre}</span>
                <span className="text-gray-600">{u.email}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}