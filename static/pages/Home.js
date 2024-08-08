const Home = {
  template: `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <nav style="background-color: #333; padding: 1rem;">
        <ul style="list-style-type: none; margin: 0; padding: 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem;">
          <li><router-link to="/" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Home</router-link></li>
          <li><router-link to="/user-login" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Login</router-link></li>
          <li><router-link to="/signup" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Sign Up</router-link></li>
          <li><router-link to="/lib-dashboard" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Librarian Dashboard</router-link></li>
          <li><router-link to="/user-dashboard" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">User Dashboard</router-link></li>
          <li><router-link to="/profile" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Profile</router-link></li>
        </ul>
      </nav>
      <header style="background-image: url('https://example.com/your-hero-image.jpg'); background-size: cover; background-position: center; color: black; padding: 4rem 0; position: relative;">
        <div style="background-color: #FFF3E0; padding: 2rem; border-radius: 8px; display: inline-block; max-width: 90%; margin: 0 auto;">
          <h1 style="font-size: 3rem; margin: 0;">Welcome to the Library Management System</h1>
          <p style="font-size: 1.2rem; margin: 1rem 0;">Your one-stop solution for managing library activities.</p>
          <router-link to="/user-login">
            <button style="background-color: #FF6F61; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s;">Get Started</button>
          </router-link>
        </div>
      </header>
      <section style="background-color: #FFEBEE; padding: 4rem 0;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem;">Features</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; padding: 0 2rem;">
          <div style="padding: 2rem; background-color: #FFCDD2; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <h3 style="margin-bottom: 1rem;">Search Books</h3>
            <p>Find the books you need quickly and easily.</p>
          </div>
          <div style="padding: 2rem; background-color: #FFCDD2; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <h3 style="margin-bottom: 1rem;">Manage Your Account</h3>
            <p>Keep track of your borrowed books and profile details.</p>
          </div>
          <div style="padding: 2rem; background-color: #FFCDD2; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <h3 style="margin-bottom: 1rem;">Connect with Librarians</h3>
            <p>Get assistance from librarians for any queries.</p>
          </div>
        </div>
      </section>
      <section style="background-color: #E3F2FD; padding: 4rem 0;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem;">Testimonials</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; padding: 0 2rem;">
          <div style="padding: 2rem; background-color: #BBDEFB; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <p>"This library system has revolutionized the way I borrow and read books. Highly recommend!"</p>
            <p>- Alex Johnson</p>
          </div>
          <div style="padding: 2rem; background-color: #BBDEFB; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <p>"Managing my library account has never been easier. Kudos to the team!"</p>
            <p>- Emily Smith</p>
          </div>
          <div style="padding: 2rem; background-color: #BBDEFB; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; transition: transform 0.3s;">
            <p>"A seamless and user-friendly experience. I love the quick search feature."</p>
            <p>- John Doe</p>
          </div>
        </div>
      </section>
      <section style="background-color: #FFF3E0; padding: 4rem 0;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem;">Get Involved</h2>
        <p style="font-size: 1.2rem; margin: 1rem 0;">Join our community of book lovers and stay updated with the latest news and events.</p>
        <router-link to="/signup">
          <button style="background-color: #FFA726; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s;">Sign Up Now</button>
        </router-link>
      </section>
      <footer style="background-color: #333; color: white; padding: 2rem 0;">
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 200px;">
            <h3>About Us</h3>
            <p>We are dedicated to providing the best library management system to make your reading experience delightful.</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <h3>Contact</h3>
            <p>Email: support@library.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <h3>Follow Us</h3>
            <p>Facebook | Twitter | Instagram</p>
          </div>
        </div>
        <p style="margin-top: 2rem;">&copy; 2024 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  `,
};

export default Home;
