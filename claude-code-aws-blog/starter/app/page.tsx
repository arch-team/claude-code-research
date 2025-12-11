export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section - Students will build this in Exercise 005 */}
      <section className="mb-16">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Your AWS Blog
          </h1>
          <p className="text-lg text-aws-dark-gray mb-6">
            You'll build this hero section in the next exercise
          </p>
        </div>
      </section>

      {/* Post List - Students will build this in Exercise 006 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="text-aws-dark-gray">
          <p>Post list will be added in Exercise 006</p>
        </div>
      </section>
    </div>
  );
}
