const Home = {
  template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; color: #333;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; padding: 4rem 2rem; background-color: #fffff; color: black;">
        <div style="flex: 1; padding: 2rem;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">Welcome to the Library</h1>
          <p style="font-size: 1.2rem; margin-bottom: 2rem;">Your one-stop solution for managing library activities.</p>
          <router-link to="/user-login">
            <button style="background-color: #FFC107; color: #333; padding: 1rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s, transform 0.3s;">
              Get Started
            </button>
          </router-link>
        </div>
        <div style="flex: 1;">
          <img src="/static/books.jpg" alt="Library" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);" />
        </div>
      </header>
      
      <section style="padding: 4rem 2rem;">
        <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: #007BFF;">Features</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="padding: 2rem; background-color: #E3F2FD; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px;">
            <i class="fas fa-book" style="font-size: 2rem; color: #007BFF;"></i>
            <h3 style="margin-top: 1rem; color: #007BFF;">Search Books</h3>
            <p style="color: #555;">Find the books you need quickly and easily.</p>
          </div>
          <div style="padding: 2rem; background-color: #E8F5E9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px;">
            <i class="fas fa-user-cog" style="font-size: 2rem; color: #28A745;"></i>
            <h3 style="margin-top: 1rem; color: #28A745;">Manage Your Account</h3>
            <p style="color: #555;">Keep track of your borrowed books and profile details.</p>
          </div>
          <div style="padding: 2rem; background-color: #E0F7FA; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px;">
            <i class="fas fa-comments" style="font-size: 2rem; color: #17A2B8;"></i>
            <h3 style="margin-top: 1rem; color: #17A2B8;">Connect with Librarians</h3>
            <p style="color: #555;">Get assistance from librarians for any queries.</p>
          </div>
        </div>
      </section>
      
      <section style="background-color: #F8F9FA; padding: 4rem 2rem;">
        <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: #343A40;">Testimonials</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
          <div style="flex: 1; padding: 2rem; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; min-width: 300px;">
            <p style="color: #555;">"This library system has revolutionized the way I borrow and read books. Highly recommend!"</p>
            <p style="color: #007BFF; font-weight: bold;">- Alex Johnson</p>
          </div>
          <div style="flex: 1; padding: 2rem; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; min-width: 300px;">
            <p style="color: #555;">"Managing my library account has never been easier. Kudos to the team!"</p>
            <p style="color: #28A745; font-weight: bold;">- Emily Smith</p>
          </div>
          <div style="flex: 1; padding: 2rem; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; min-width: 300px;">
            <p style="color: #555;">"A seamless and user-friendly experience. I love the quick search feature."</p>
            <p style="color: #17A2B8; font-weight: bold;">- John Doe</p>
          </div>
        </div>
      </section>
      
      <section style="background-color: #ffffff; padding: 4rem 2rem;">
        <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: #343A40;">Get Involved</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #666;">Join our community of book lovers and stay updated with the latest news and events.</p>
        <router-link to="/signup">
          <button style="background-color: #28A745; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s, transform 0.3s;">
            Sign Up Now
          </button>
        </router-link>
      </section>
      
      <footer style="background-color: #343A40; color: white; padding: 2rem 2rem;">
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: #FFC107;">About Us</h3>
            <p style="color: #ccc;">We are dedicated to providing the best library management system to make your reading experience delightful.</p>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: #FFC107;">Contact</h3>
            <p style="color: #ccc;">Email: support@library.com</p>
            <p style="color: #ccc;">Phone: +123 456 7890</p>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: #FFC107;">Follow Us</h3>
            <p style="color: #ccc;">Facebook | Twitter | Instagram</p>
          </div>
        </div>
        <p style="margin-top: 2rem; color: #777;">&copy; 2024 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  `,
};

export default Home;
