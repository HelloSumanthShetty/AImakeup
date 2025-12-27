import Navbar from "./components/navbar";
import Makeup from "./components/makeup";
import Footer from "./components/footer";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-200 to-rose-300 relative flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 pt-24">
        <Makeup />
      </main>
      <Footer />
    </div>
  )
}

export default App
