'use client';

const SocialAuth = () => {
  return (
    <div className="flex justify-center gap-4 mt-3">

      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
        className="w-6 h-6 object-contain cursor-pointer"
      />

      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
        className="w-6 h-6 object-contain cursor-pointer"
      />

      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
        className="w-6 h-6 object-contain cursor-pointer"
      />

    </div>
  );
};

export default SocialAuth;