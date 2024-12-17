import { useThemeStore } from "../stores/store";

export const Navbar = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <nav
      className={`${
        theme === "dark" ? "dark-theme" : "light-theme"
      } flex justify-between px-2 sm:px-6 py-2 border-b border-gray-500/25`}
    >
      <a href="/" className="text-2xl font-semibold">
        Cal<span className="text-blue-400">Spot</span>
      </a>

      <div className="flex justify-between items-center gap-4 text-lg">
        <div
          onClick={() => setTheme()}
          className="flex justify-center items-center h-9 w-9 bg-gray-200 text-lg rounded-md cursor-pointer"
        >
          <p>{theme === "dark" ? "🌞" : "🌚"}</p>
        </div>
      </div>
    </nav>
  );
};
