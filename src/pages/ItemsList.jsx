import { useEffect, useState } from 'react'
import ItemCard from '../components/ItemCard'
import { useItemStore } from '../store/useItemStore'
import { useUserStore } from '../store/useUserStore'

const ItemsList = ({ title = 'Товары', showOwn = false }) => {

    const { items, getItems } = useItemStore()
    const { session } = useUserStore()
    const [isloading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [timerId, setTimerId] = useState(undefined)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                await getItems()
            } catch (error) {
                console.error(error)
                setError(error.message || "Что то пошло не так")
            } finally {
                setIsLoading(false)
            }
        }
        load()
        setTimerId(setInterval(() => {
            try {
                getItems()

            } catch (error) { }
        }, 10000))

        return () => {
            clearInterval(timerId)
        }
    }, [])


    return (
        <div className="container">
            <div class="page-header">
                <h1>Все товары</h1>
            </div>
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-value">0</span>
                    <span class="stat-label">Товаров</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">0</span>
                    <span class="stat-label">Ставок</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">0</span>
                    <span class="stat-label">Активных</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">0₽</span>
                    <span class="stat-label">Средняя цена</span>
                </div>
            </div>
            {isloading && <p>Загрузка...</p>}
            {!isloading && error && <p> {error} </p>}
            {!isloading && !error && items && (
                <div class="items-grid">
                    {showOwn ? items.filter(el => el.userId === session?.user.id).map((item, i) => (
                        <ItemCard key={i} {...item} />))
                        : items.map((item, i) => (
                            <ItemCard key={i} {...item} />
                        ))}
                </div>
            )}
        </div>
    )
}

export default ItemsList
