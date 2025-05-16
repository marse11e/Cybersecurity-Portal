import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Monitor, 
  Users,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero секция */}
      <section className="bg-[#222222] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Изучайте кибербезопасность на практике
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Получите практический опыт с помощью интерактивных симуляций, тестов и курсов. 
                Развивайте навыки кибербезопасности в безопасной среде.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses" className="btn bg-[#ffcc00] text-black hover:bg-[#ffd633] transition-colors">
                  Начать обучение
                </Link>
                <Link to="/about" className="btn border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors">
                  Узнать больше
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Кибербезопасность" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Особенности */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Почему выбирают нашу платформу
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
              <div className="p-3 bg-[#333333] text-[#ffcc00] rounded-lg inline-block mb-4">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Интерактивные симуляции</h3>
              <p className="text-gray-400">
                Получите опыт работы с реальными сценариями кибератак в безопасной среде
              </p>
            </div>
            <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
              <div className="p-3 bg-[#333333] text-[#ffcc00] rounded-lg inline-block mb-4">
                <Book className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Практические курсы</h3>
              <p className="text-gray-400">
                Структурированные курсы с фокусом на практические навыки и реальные примеры
              </p>
            </div>
            <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
              <div className="p-3 bg-[#333333] text-[#ffcc00] rounded-lg inline-block mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Сообщество экспертов</h3>
              <p className="text-gray-400">
                Учитесь у профессионалов и обменивайтесь опытом с другими учащимися
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Популярные курсы */}
      <section className="py-20 bg-[#222222]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Популярные курсы</h2>
            <Link 
              to="/courses" 
              className="text-[#ffcc00] hover:text-[#ffd633] font-medium flex items-center"
            >
              Все курсы <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Карточки курсов */}
            <CourseCard 
              title="Основы кибербезопасности"
              description="Базовый курс по основам информационной безопасности и защите данных"
              image="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              duration="6 недель"
              level="Начальный"
              rating={4.8}
            />
            <CourseCard 
              title="Этичный хакинг"
              description="Изучите методы тестирования безопасности и этичного хакинга"
              image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              duration="8 недель"
              level="Продвинутый"
              rating={4.9}
            />
            <CourseCard 
              title="Безопасность сетей"
              description="Комплексный курс по защите сетевой инфраструктуры"
              image="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              duration="10 недель"
              level="Средний"
              rating={4.7}
            />
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-20 bg-[#1a1a1a] text-white border-y border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-slate-400">Активных студентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-slate-400">Экспертных курсов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-slate-400">Положительных отзывов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-slate-400">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-20 bg-[#222222]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Готовы начать свой путь в кибербезопасности?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые уже развивают свои навыки 
            на нашей платформе. Начните обучение сегодня!
          </p>
          <Link to="/register" className="btn bg-[#ffcc00] text-black hover:bg-[#ffd633] transition-colors">
            Начать бесплатно
          </Link>
        </div>
      </section>
    </div>
  );
};

// Компонент карточки курса
const CourseCard: React.FC<{
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  rating: number;
}> = ({ title, description, image, duration, level, rating }) => (
  <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>
        <span className="px-2 py-1 bg-[#333333] text-[#ffcc00] rounded-full">{level}</span>
      </div>
      <div className="flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    </div>
  </div>
);

export default HomePage;