import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from 'react-router-dom';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { 
        const fetchBids = async () => {
            try { 
                setLoading(true)
                setError(null)
                const res = await api.getMyBids()
                setBids(res.data)
            } catch (err) {
                setError('Не удалось загрузить историю ставок.');
                console.error(err)
            } finally { 
                setLoading(false);
            }
        }
        fetchBids(); }, []);

        const totalCount = bids.length
        const winningCount = bids.filter((bid) => bid.isWinning).length
        const totalAmount = bids.reduce((sum, bid) => sum + bid.amount, 0)

        if (loading) {
             return (
                <div className="container">
                    <div className="page-header">
                        <h1>Мои ставки</h1>
                    </div>
                    <p>Загрузка ставок...</p>
                </div>
             )
        }

        if (error) {
             return ( 
             <div className="container"> 
                 <div className="page-header"> 
                     <h1>Мои ставки</h1> 
             </div>
                 <p className="error-message">{error}</p>
            </div>
             )
         }

    return (
        <div className="container">

            <div class="page-header">
                <h1>Мои ставки</h1>
                <p class="page-subtitle">История ваших ставок на товары</p>
            </div>

            <div class="bids-summary">
                <div class="summary-card">
                    <span class="summary-value">{totalAmount}</span>
                    <span class="summary-label">Всего ставок</span>
                </div>
                <div class="summary-card winning">
                    <span class="summary-value">{winningCount}</span>
                    <span class="summary-label">Лидирующих ставок</span>
                </div>
                <div class="summary-card">
                    <span class="summary-value">{totalCount}₽</span>
                    <span class="summary-label">Общая сумма</span>
                </div>
            </div>

            <div class="bids-list">
               {bids.map((bid) => (
                 <div key={bid.id} className={`bid-item ${bid.isWinning ? 'winning' : ''}`}>
                    {/* <img src="https://via.placeholder.com/80x80/3498db/ffffff?text=Laptop" alt="Ноутбук" class="bid-item-image"/> */}
                    <div class="bid-item-content">
                        <div class="bid-item-header">
                            <Link to={`/item/${bid.itemId}`} className="bid-item-title">
                             {bid.itemTitle} 
                             </Link>
                            {bid.isWinning ? ( <span className="winning-badge">🏆 Лидирую</span> ) : ( <span className="outbid-badge">Перебита</span> )}
                        </div>
                    </div>
                    <div class="bid-item-amount">
                        <span class="bid-amount">{bid.amount.toLocaleString()} ₽</span>
                        <span class="bid-status">Моя ставка</span>
                        {!bid.isWinning && ( <div className="current-highest"> 
                            Текущая: {bid.amount.toLocaleString()} ₽ 
                            </div> 
                        )}
                    </div>
                </div>
            ))}
            {bids.length === 0 && ( 
                <p className="empty-state">Вы пока не сделали ни одной ставки.</p> 
            )}
            </div>
        </div>
    )
}

export default MyBids
