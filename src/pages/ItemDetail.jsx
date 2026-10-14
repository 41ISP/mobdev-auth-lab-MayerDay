import { Link, useParams } from "react-router-dom"
import Input from "../components/Input"
import Button from "../components/Button"
import { useItemStore } from "../store/useItemStore"
import { api } from "../api/api"
import { useState } from "react"
import { useUserStore } from "../store/useUserStore"

const ItemDetail = () => {
    const {id} = useParams()
    const session = useUserStore((state) => state.session)
    const item = useItemStore((state) => state.item)
    const getItems = useItemStore((state) => state.getItems)
    const [error, setError] = useState('')
    const [bids, setBids] = useState([])
   
    useEffect(() => {
        if (!item) { getItems(id) }

    const loadBids = async () => {
        try { 
            const data = await api.getItemBids(id)
            setBids(data)
        } catch (err) {
            console.error('Не удалось загрузить историю ставок:', err)
        }
    }
    loadBids() 
}, [id, item, getItems])


if (!item) return <div className="container">Загрузка...</div>

    const handleBid = async (e) => {
        e.preventDefault()
        setError('')

    const form = e.target 
    const amount = Number(form.bidInput.value)
    if (!amount || amount <= 0) { 
        setError('Введите корректную сумму ставки')
        return 
    }

    try {
        await api.createBid({ id, amount })
        form.reset()
        await getItems()

        const data = await api.getItemBids(id)
        setBids(data)

    } catch (err) {
        setError(err.message || 'Не удалось сделать ставку')
    }
}
    

const displayBid = item.highestBid === null ? 'ставок нет' : item.highestBid 
const minBidValue = item.highestBid ?? item.price 
const formattedDate = new Date(item.createdAt).toLocaleString("ru-RU")

const isOwner = session?.user?.id === item.userId

const handleDelete = async () => {
    try { 
        await api.deleteItem(id)
        await getItems()
        window.location.href = "/"
    } catch (err) {
        setError(err.message || 'Не удалось удалить товар')
    }
}

    return (
        <div className="container">

            <Link to={"/"}>← Вернуться к списку товаров</Link>

            <div class="item-detail">
                <div class="item-header">
                    <div>
                         <img src={item.imageUrl} class="item-image-large" />
                    </div>

                    <div class="item-info">
                        <span class="item-status">{item.status}</span>
                            
                        <h1 class="item-title-large">{item.title}</h1>
                            
                        <div class="item-seller-info">
                            <div class="seller-avatar">
                                {item.username.slice(0, 2).toUpperCase()}
                            </div>

                            <div class="seller-details">
                                <div class="seller-name">{item.username}</div>
                                <div class="seller-date">{formattedDate}</div>
                            </div>
                        </div>

                        <div class="item-description-full">
                            {item.description}
                        </div>

                        <div class="price-section">
                            <div class="starting-price">Начальная цена:</div>
                            <div class="current-price">{item.price} ₽</div>
                            <div class="highest-bid">Текущая ставка: {displayBid} ₽</div>

                            <form class="bid-form" onSubmit={handleBid}>
                                <Input 
                                    type="number" 
                                    name= "bidInput"
                                    class="bid-input" 
                                    placeholder={`Введите вашу ставку (мин. ${minBidValue + 1} ₽)`}
                                    min={minBidValue + 1}
                                    step="100"
                                />
                                <Button type="submit" class="btn-bid">Сделать ставку</Button>
                            </form>
                         {error && (
                                <div className="alert alert-error active" style={{ marginTop: '10px' }}>
                                        {error} 
                                </div>
                            )}

                        {isOwner && (
                            <Button type="button" className="btn-delete" onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: '#dc2626' }}>
                                 Удалить товар 
                            </Button>
                        )}
                        </div>

                    </div>
                </div>

                <div class="bids-section">
                    <div class="bids-header">
                        <h2 class="bids-title">История ставок</h2>
                        <span class="bids-count">{bids.length}</span>
                </div>

                    <div class="bids-list">
                        {bids.map((bid, index) => (
                            <div key={bid.id || index} className={`bid-item ${index === 0 ? 'highest-bid-item' : ''}`} >

                            <div class="bid-user">
                                <div class="bid-avatar">{bid.username.slice(0, 2).toUpperCase()}</div>
                                <div class="bid-details">
                                    <span class="bid-username">{bid.username}</span>
                                    <span class="bid-time">{new Date(bid.createdAt).toLocaleString("ru-RU")}</span>
                                </div>
                                {index === 0 && <span className="highest-badge">🏆 Лидирует</span>}
                            </div>
                            <div class="bid-amount">{bid.amount} ₽</div>
                        </div>
                        ))}
                     </div> 
                 </div> 
            </div>
            

   
        </div>
    )
}

export default ItemDetail
