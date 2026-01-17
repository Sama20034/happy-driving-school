const AnimatedParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary-foreground/30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Larger floating circles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-4 h-4 rounded-full bg-primary-foreground/20 animate-float-slow"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 18}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedParticles;
