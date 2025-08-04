import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">О нашей команде</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы - команда энтузиастов, студенты-бауманцы, которые занимаются музыкой. Зная программирование, мы сделали площадку, которая позволит найти единомышленников и новые знакомства, коллабы.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Наша миссия</h2>
            <p className="text-gray-600">
              Помогать начинающим музыкантам расти и развиваться через дружное сообщество, а уже более опытным - найти новые коллабы и новые знакомства. 
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Наше видение</h2>
            <p className="text-gray-600">
              Стать ведущей площадкой для музыкантов, которая поможет найти пристанище для каждого музыкального творчества.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center min-h-[400px] flex flex-col justify-center">
              <div className="w-96 h-96 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="https://i.pinimg.com/1200x/86/0c/1c/860c1ce5d8fc0fded828e5a17939cb58.jpg" 
                  alt="Борис Хижняк"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg" style={{display: 'none'}}>
                  БХ
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Борис Хижняк, 300 метров от вас</h3>
              <p className="text-gray-600 mb-3 text-lg">Designer & Frontend Developer</p>
              <p className="text-gray-500">
                Могу сделать вам верстку сайта, сделать дизайн-проект и отсосать ваш х..
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center min-h-[400px] flex flex-col justify-center">
              <div className="w-96 h-96 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/30/b1/ef/30b1ef227bc2ccffb7a1be3aba5ad00c.jpg" 
                  alt="Илья Петров"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg" style={{display: 'none'}}>
                  ИП
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Илья Петров</h3>
              <p className="text-gray-600 mb-3 text-lg">Привет, Никит</p>
              <p className="text-gray-500">
                Эксперт в "как дела? Кстати, как ты сделал первый номер в ДЗ по Линалу?"
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center min-h-[400px] flex flex-col justify-center">
              <div className="w-96 h-96 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="/images/team/mikhail.jpg" 
                  alt="gottherage"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg" style={{display: 'none'}}>
                  GT
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">gottherage</h3>
              <p className="text-gray-600 mb-3 text-lg">Data Scientist & Backend Developer</p>
              <p className="text-gray-500">
                Специалист по Python, FastAPI и SQL
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Наши достижения</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">0+</div>
              <div className="text-gray-600">Завершенных проектов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Недовольных клиентов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
              <div className="text-gray-600">Лет опыта</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2/2</div>
              <div className="text-gray-600">Взятых академов</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage; 