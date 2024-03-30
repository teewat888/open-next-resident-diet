function PageHeader({ headerText }: { headerText: string }) {
  return (
    <div className='flex items-center'>
      <h1 className='text-lg font-semibold md:text-2xl'>{headerText}</h1>
    </div>
  );
}
export default PageHeader;
