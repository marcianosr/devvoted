export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-stone-100 lg:p-16 flex flex-col gap-4">{children}</div>
  );
};
