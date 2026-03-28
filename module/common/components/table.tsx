'use client';
import { useMemo, useState, type CSSProperties, type JSX } from "react";

type Header<T> = {
    key: keyof T;
    title: string;
};

type Props<T> = {
    showPagination?: boolean;
    headers: Header<T>[];
    headerStyles?: CSSProperties
    styleByField?: (field: keyof T, value: T[keyof T]) => CSSProperties | undefined
    parseValue?: (field: keyof T, value: T[keyof T]) => string | number
    onRenderField?: (field: keyof T, value: T[keyof T], item: T) => React.ReactNode
    data: T[];
    pageSize?: number;
    numeration?: boolean;
    numerationTitle?: string
    tableClassNameContent?: string
    containerClassName?: string,
    selectable?: boolean
    FooterComponent?: (props: { currentPage: number, allItems: number, pageSize: number, allPages: number, goToPage: (page: number) => void, next: () => void, prev: () => void }) => JSX.Element
};
//TODO: Falta agregar props para controlar que acción realizar por fila como se ve en el diseño de figma, [ver, editar, eliminar]
export function Table<T extends Record<string, unknown>>({
    headers,
    data,
    pageSize = 10,
    headerStyles,
    showPagination = true,
    styleByField,
    parseValue,
    numeration,
    onRenderField,
    tableClassNameContent,
    numerationTitle,
    containerClassName,
    selectable,
    FooterComponent
}: Props<T>) {

    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(data.length / pageSize);
    const [selected, setSelected] = useState<number[]>([])


    const handleSelectAll = () => {
        setSelected(selected.length === data.length ? [] : data.map((_, i) => i))
    }

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, page, pageSize]);

    return (
        <div className="w-full">

            <div className={
                "overflow-x-auto rounded-box border border-base-content/5 bg-base-100 " +
                containerClassName
            }>
                <table className={"table border-base-300 border " + tableClassNameContent}>

                    <thead className="bg-base-300" style={headerStyles}>
                        <tr>
                            {
                                numeration &&
                                <th>

                                    {
                                        selectable &&
                                        <input type="checkbox" title="Seleccionar todos" checked={selected.length === data.length} onChange={handleSelectAll} className="checkbox checkbox-sm mr-2" />
                                    }
                                    {numerationTitle ?? '#'}
                                </th>
                            }
                            {headers.map((h) => (
                                <th key={String(h.key)}>

                                    {h.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.map((row, i) => (
                            <tr key={i} >
                                {
                                    numeration &&
                                    <td>
                                        {
                                            selectable &&
                                            <input type="checkbox" checked={selected.includes(i)} onChange={() => setSelected(selected.includes(i) ? selected.filter((id) => id !== i) : [...selected, i])} className="checkbox  checkbox-sm mr-2" />
                                        }
                                        {i + 1}

                                    </td>
                                }
                                {headers.map((h) => {
                                    const component = onRenderField?.(h.key, row[h.key], row)
                                    return (
                                        <td key={String(h.key)} style={styleByField?.(h.key, row[h.key])}>
                                            {
                                                component ? component :
                                                    (parseValue ? parseValue(h.key, row[h.key]) : row[h.key]) as React.ReactNode
                                            }
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            {
                showPagination &&
                <>
                    {
                        FooterComponent ? FooterComponent({ currentPage: page, goToPage: (val: number) => setPage(val), allItems: data.length, pageSize, allPages: totalPages, next: () => setPage((p) => p + 1), prev: () => setPage((p) => p - 1) }) :
                            <div className="flex justify-center gap-2 mt-3">

                                <button
                                    className="btn btn-sm"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Prev
                                </button>

                                <span className="flex items-center px-2">
                                    {page} / {totalPages}
                                </span>

                                <button
                                    className="btn btn-sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </button>

                            </div>
                    }
                </>
            }

        </div >
    );
}