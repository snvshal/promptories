const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Promptories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
