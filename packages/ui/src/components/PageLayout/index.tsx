export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-stone-100 dark:bg-stone-600 lg:p-16">{children}</div>
  );
};
