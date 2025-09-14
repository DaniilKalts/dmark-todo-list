import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';

export default function TrashPage({ tasks, loadTasks, onRestore, onHardDelete, onEmptyTrash }) {
    const [order, setOrder] = useState('desc');
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        loadTasks('deleted', order);
    }, [order, loadTasks]);

    const handleRestore = async (task) => {
        await onRestore(task, 'deleted', order);
    };

    const handleEmptyTrash = async () => {
        if (!tasks.length) return;
        const ok = window.confirm('Очистить корзину? Это удалит все задачи безвозвратно.');
        if (!ok) return;

        try {
            setIsClearing(true);
            await onEmptyTrash('deleted', order);
        } finally {
            setIsClearing(false);
        }
    };

    const isEmpty = tasks.length === 0;

    return (
        <>
            {/* Заголовок */}
            <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Корзина</h1>

                {/* Панель управления: на мобиле в столбик, на sm+ в одну строку */}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <TaskFilters
                        order={order}
                        setOrder={setOrder}
                        className="w-full sm:w-auto"
                    />

                    {/* Кнопка показывается только если есть задачи в корзине */}
                    {!isEmpty && (
                        <button
                            type="button"
                            onClick={handleEmptyTrash}
                            disabled={isClearing}
                            className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2 h-10 px-3 rounded-lg
                border border-red-300 dark:border-red-600
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500
                active:scale-[.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition whitespace-nowrap
              "
                            aria-label="Очистить корзину"
                            title="Удалить все задачи из корзины"
                        >
                            <span className="text-lg">🧹</span>
                            <span>Очистить корзину</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Контент */}
            <div className="flex-1 flex">
                {isEmpty ? (
                    <div className="flex-1 grid place-items-center">
                        <EmptyState icon="🗑️" message="Корзина пуста. Пока нечего удалять!" />
                    </div>
                ) : (
                    <div className="w-full">
                        <TaskList
                            tasks={tasks}
                            isTrash
                            onRestore={handleRestore}
                            onHardDelete={(task) => onHardDelete(task, 'deleted', order)}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
