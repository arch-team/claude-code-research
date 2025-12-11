export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-aws-orange rounded-3xl px-8 py-20 text-center animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-6">
              Build AI-Powered Applications with Claude Code on AWS
            </h1>
            <p className="text-xl text-white mb-8">
              Learn how to leverage Claude Code with AWS Bedrock to build intelligent applications.
              Discover integration patterns, MCP servers, CI/CD workflows, and industry best practices
              for AI-powered development.
            </p>
            <a
              href="https://aws.amazon.com/bedrock/"
              className="btn bg-aws-dark text-white px-8 py-4 rounded-lg font-semibold inline-block animate-fadeIn animation-delay-200"
            >
              Explore AWS Bedrock
            </a>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
        <div className="text-aws-dark-gray">
          <p>Post list will be added in Exercise 006</p>
        </div>
      </section>
    </div>
  );
}
