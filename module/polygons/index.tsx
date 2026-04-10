'use client';
import { useToast } from '../common/hook/useToast';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PolygonData } from './components/polygon-input';
import { FiChevronRight, FiCornerUpLeft, FiDollarSign, FiDroplet, FiEdit3, FiEye, FiEyeOff, FiMapPin, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { useBranches } from '../branches/context/use-branches';
import { Tables } from '@/supabase/database.types';
import { createPolygon, deletePolygon, editPolygon, getPolygons } from './actions';
import { TbReload } from 'react-icons/tb';
import { cn } from '@/utils/cn';

const PolygonInput = dynamic(
    () => import('./components/polygon-input').then(mod => mod.PolygonInput),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-base-200 animate-pulse rounded-box flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }
)

const PRESET_COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
]

export const Polygons = () => {
    const [loadingGetPosition, setLoadingGetPosition] = useState(false)
    const { branches } = useBranches()
    const [loading, setLoading] = useState(false)
    const [branch, setBranch] = useState<Tables<'branches'> | null>(null)
    const [position, setPosition] = useState<[number, number]>([4.7110, -74.0721])
    const [polygons, setPolygons] = useState<Record<string, PolygonData>>({})
    const [points, setPoints] = useState<[number, number][]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null)
    const [showPolygonList, setShowPolygonList] = useState(true)

    // Form state for new polygon
    const [newPolygonName, setNewPolygonName] = useState('')
    const [newPolygonValue, setNewPolygonValue] = useState<number>(0)
    const [newPolygonColor, setNewPolygonColor] = useState(PRESET_COLORS[0])

    // Edit state
    const [editingPolygon, setEditingPolygon] = useState<string | null>(null)
    const [editValue, setEditValue] = useState<number>(0)
    const [editColor, setEditColor] = useState('')
    const { openToast } = useToast()

    const handleGetPosition = () => {
        if (navigator.geolocation) {
            setLoadingGetPosition(true)
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude])
                    openToast('Ubicación obtenida correctamente', 'success')
                    setLoadingGetPosition(false)
                },
                () => {
                    openToast('Error al obtener la ubicación', 'error')
                    setLoadingGetPosition(false)
                }
            )
        }
    }

    const handleSavePolygon = async () => {
        if (points.length < 3) {
            openToast('Necesitas al menos 3 puntos', 'error')
            return
        }
        if (!newPolygonName.trim()) {
            openToast('Ingresa un nombre para el área', 'error')
            return
        }
        if (polygons[newPolygonName]) {
            openToast('Ya existe un área con ese nombre', 'error')
            return
        }
        if (!branch) {
            openToast('Selecciona una sucursal', 'error')
            return
        }

        openToast('Cargando...', 'loading')

        const item = await createPolygon({
            branch_id: branch?.id!,
            color: newPolygonColor,
            description: '',
            name: newPolygonName,
            points: points,
            price: newPolygonValue,
            is_active: true
        })

        if (item.error) {
            openToast(item.error, 'error')
            return
        }

        setPolygons({
            ...polygons,
            [newPolygonName]: {
                points: points,
                color: newPolygonColor,
                value: newPolygonValue,
                branch
            }
        })
        setPoints([])
        setIsDrawing(false)
        setNewPolygonName('')
        setNewPolygonValue(0)
        setNewPolygonColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
        openToast(`Área "${newPolygonName}" guardada`, 'success')
    }

    const handleDeletePolygon = async (name: string) => {
        const check = confirm(`¿Estas seguro de eliminar el área "${name}"?`)
        if (!check) return
        openToast('Cargando...', 'loading')
        const item = await deletePolygon(polygons[name].id!)
        if (item.error) {
            openToast(item.error, 'error')
            return
        }
        const newPolygons = { ...polygons }
        delete newPolygons[name]
        setPolygons(newPolygons)
        setSelectedPolygon(null)
        openToast(`Área "${name}" eliminada`, 'info')
    }

    const handleStartEdit = (name: string) => {
        setEditingPolygon(name)
        setEditValue(polygons[name].value)
        setEditColor(polygons[name].color)
    }

    const handleSaveEdit = async () => {
        if (editingPolygon) {
            openToast('Cargando...', 'loading')
            const item = await editPolygon(polygons[editingPolygon].id!, {
                color: editColor,
                price: editValue
            })
            if (item.error) {
                openToast(item.error, 'error')
                return
            }
            setPolygons({
                ...polygons,
                [editingPolygon]: {
                    ...polygons[editingPolygon],
                    value: editValue,
                    color: editColor
                }
            })
            setEditingPolygon(null)
            openToast('Cambios guardados', 'success')
        }
    }

    const handleSelectedBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const branchId = e.target.value
        const branch = branches.find((branch) => branch.id === branchId)
        if (branch) {
            setBranch(branch)
        }
    }

    const handleCancelEdit = () => {
        setEditingPolygon(null)
    }

    const handleStopAndStartDrawing = () => {
        if (!branch) {
            openToast('Selecciona una sucursal', 'error')
            return
        }
        if (isDrawing) {
            setIsDrawing(false)
            if (points.length === 0) {
                setNewPolygonName('')
                setNewPolygonValue(0)
            }
        } else {
            setIsDrawing(true)
            setSelectedPolygon(null)
        }
    }

    const loadPolygons = useCallback(() => {
        setLoading(true)
        getPolygons().then(res => {
            const _polygons = res;
            if (_polygons) {
                const _poligonData: Record<string, PolygonData> = {}
                _polygons.forEach(e => {
                    _poligonData[e.name] = {
                        points: e.points as [number, number][],
                        color: e.color || '#ec4899',
                        value: e.price,
                        branch: e.branch,
                        id: e.id
                    }
                })
                setPolygons(_poligonData)
            }
        })
            .catch((err) => {
                console.error(err)
                openToast('Error al cargar las zonas', 'error')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        loadPolygons()
    }, [])

    const polygonCount = Object.keys(polygons).length

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow-sm px-4 lg:px-8">
                <div className="flex-1">
                    <h1 className="text-xl font-bold flex gap-2 items-center">Zonas de Cobertura <button disabled={loading} onClick={loadPolygons} className={
                        cn(
                            'btn btn-ghost btn-xs btn-circle',
                            loading && 'animate-spin'
                        )
                    }><TbReload className="cursor-pointer" /></button></h1>
                </div>
                <div className="flex-none gap-2">
                    <button
                        onClick={handleGetPosition}
                        disabled={loadingGetPosition}
                        className="btn btn-ghost btn-sm gap-2"
                    >
                        {loadingGetPosition ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <FiMapPin className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Mi ubicación</span>
                    </button>
                    <button
                        onClick={() => setShowPolygonList(!showPolygonList)}
                        className="btn btn-ghost btn-sm lg:hidden"
                    >
                        {showPolygonList ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className={`
                    ${showPolygonList ? 'flex' : 'hidden'} 
                    lg:flex flex-col w-full lg:w-80 xl:w-96 bg-base-100 border-r border-base-300 overflow-hidden
                `}>
                    {/* Drawing Controls */}
                    <div className="p-4 border-b border-base-300">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold flex items-center gap-2">
                                <FiEdit3 className="w-4 h-4" />
                                Dibujar Área
                            </h2>
                            <div className="badge badge-neutral badge-sm">
                                {points.length} puntos
                            </div>
                        </div>

                        <div className='flex'>
                            <button
                                onClick={handleStopAndStartDrawing}
                                className={`btn btn-sm shadow-none gap-2 ${isDrawing ? 'btn-error' : 'btn-primary'}`}
                            >
                                {isDrawing ? (
                                    <>
                                        <FiX className="w-4 h-4" />
                                        Cancelar dibujo
                                    </>
                                ) : (
                                    <>
                                        <FiPlus className="w-4 h-4" />
                                        Comenzar a dibujar
                                    </>
                                )}
                            </button>

                            <select onChange={handleSelectedBranch} disabled={isDrawing} className='select select-sm'>
                                <option value="">Selecciona una sucursal</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isDrawing && (
                            <div className="mt-3 p-3 bg-base-200 rounded-box text-sm">
                                <p className="text-base-content/70">
                                    Haz clic en el mapa para agregar puntos. Necesitas mínimo 3 puntos.
                                </p>
                            </div>
                        )}

                        {/* New Polygon Form */}
                        {(isDrawing || points.length > 0) && (
                            <div className="mt-4 space-y-3">
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-xs font-medium">Nombre del área</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Zona Norte"
                                        value={newPolygonName}
                                        onChange={(e) => setNewPolygonName(e.target.value)}
                                        className="input input-bordered input-sm w-full"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-xs font-medium flex items-center gap-1">
                                            <FiDollarSign className="w-3 h-3" />
                                            Valor del domicilio
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newPolygonValue}
                                        onChange={(e) => setNewPolygonValue(Number(e.target.value))}
                                        className="input input-bordered input-sm w-full"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-xs font-medium flex items-center gap-1">
                                            <FiDroplet className="w-3 h-3" />
                                            Color del área
                                        </span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewPolygonColor(color)}
                                                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${newPolygonColor === color
                                                    ? 'border-base-content ring-2 ring-offset-2 ring-base-content'
                                                    : 'border-transparent'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setPoints(points.slice(0, -1))}
                                        disabled={points.length === 0}
                                        className="btn btn-ghost btn-sm flex-1 gap-1"
                                    >
                                        <FiCornerUpLeft className="w-4 h-4" />
                                        Deshacer
                                    </button>
                                    <button
                                        onClick={handleSavePolygon}
                                        disabled={points.length < 3 || !newPolygonName.trim()}
                                        className="btn btn-success btn-sm flex-1 gap-1"
                                    >
                                        <FiSave className="w-4 h-4" />
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Polygon List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold">Áreas guardadas</h2>
                            <div className="badge badge-primary">{polygonCount}</div>
                        </div>

                        {polygonCount === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-3 bg-base-200 rounded-full flex items-center justify-center">
                                    <FiMapPin className="w-8 h-8 text-base-content/30" />
                                </div>
                                <p className="text-base-content/50 text-sm">
                                    No hay áreas definidas
                                </p>
                                <p className="text-base-content/40 text-xs mt-1">
                                    Dibuja tu primera zona de cobertura
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(polygons).map(([name, data]) => (
                                    <div
                                        key={name}
                                        className={`card bg-base-200 cursor-pointer transition-all hover:bg-base-300 ${selectedPolygon === name ? 'ring-2 ring-primary' : ''
                                            }`}
                                        onClick={() => setSelectedPolygon(selectedPolygon === name ? null : name)}
                                    >
                                        <div className="card-body p-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full shrink-0"
                                                    style={{ backgroundColor: data.color }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{name}</p>
                                                    <p className="text-xs text-base-content/60">
                                                        ${data.value.toLocaleString()} • {data.points.length} puntos
                                                    </p>
                                                </div>
                                                <FiChevronRight className={`w-4 h-4 text-base-content/40 transition-transform ${selectedPolygon === name ? 'rotate-90' : ''
                                                    }`} />
                                            </div>

                                            {/* Expanded Edit Section */}
                                            {selectedPolygon === name && (
                                                <div className="mt-3 pt-3 border-t border-base-300" onClick={(e) => e.stopPropagation()}>
                                                    {editingPolygon === name ? (
                                                        <div className="space-y-3">
                                                            <div className="form-control">
                                                                <label className="label py-1">
                                                                    <span className="label-text text-xs">Valor</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(Number(e.target.value))}
                                                                    className="input input-bordered input-sm w-full"
                                                                />
                                                            </div>
                                                            <div className="form-control">
                                                                <label className="label py-1">
                                                                    <span className="label-text text-xs">Color</span>
                                                                </label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {PRESET_COLORS.map((color) => (
                                                                        <button
                                                                            key={color}
                                                                            onClick={() => setEditColor(color)}
                                                                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${editColor === color
                                                                                ? 'border-base-content'
                                                                                : 'border-transparent'
                                                                                }`}
                                                                            style={{ backgroundColor: color }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="btn btn-ghost btn-xs flex-1"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    onClick={handleSaveEdit}
                                                                    className="btn btn-success btn-xs flex-1"
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleStartEdit(name)}
                                                                className="btn btn-ghost btn-xs flex-1 gap-1"
                                                            >
                                                                <FiEdit3 className="w-3 h-3" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePolygon(name)}
                                                                className="btn btn-ghost btn-xs text-error flex-1 gap-1"
                                                            >
                                                                <FiTrash2 className="w-3 h-3" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary Footer */}
                    {polygonCount > 0 && (
                        <div className="p-4 bg-base-200 border-t border-base-300">
                            <div className="stats stats-horizontal bg-base-100 w-full shadow-sm">
                                <div className="stat px-3 py-2">
                                    <div className="stat-title text-xs">Áreas</div>
                                    <div className="stat-value text-lg">{polygonCount}</div>
                                </div>
                                <div className="stat px-3 py-2">
                                    <div className="stat-title text-xs">Valor promedio</div>
                                    <div className="stat-value text-lg">
                                        ${Math.round(
                                            Object.values(polygons).reduce((a, b) => a + b.value, 0) / polygonCount
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Map Area */}
                <main className="flex-1 relative">
                    {/* Drawing Mode Indicator */}
                    {isDrawing && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                            <div className="alert alert-info shadow-lg py-2 px-4">
                                <FiEdit3 className="w-4 h-4" />
                                <span className="text-sm font-medium">Modo dibujo activo - Haz clic en el mapa</span>
                            </div>
                        </div>
                    )}

                    <PolygonInput
                        position={position}
                        points={points}
                        isDrawing={isDrawing}
                        polygons={polygons}
                        onAddPoint={(latlng) => setPoints([...points, latlng])}
                        activeColor={newPolygonColor}
                        onPolygonClick={(name) => {
                            setSelectedPolygon(name)
                            setShowPolygonList(true)
                        }}
                    />
                </main>
            </div>
        </div>
    )
}

