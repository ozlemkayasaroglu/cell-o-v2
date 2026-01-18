import packageJson from "../../package.json";

const AppFooter = () => {
  return (
    <footer className="w-full text-center py-4 bg-transparent text-[#94A3B8] text-xs">
      <div>
        <span>For my little unicorn, made with love by </span>
        <a
          href="https://ozlemkayasaroglu.com"
          className="text-rose-300 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Özlem K.
        </a>
        <p className="text-gray-300">{`v${packageJson.version}`}</p>
      </div>
    </footer>
  );
};

export default AppFooter;
