import { EmptyState } from './components/EmptyState';
import { useStorage } from './hooks/useStorage';
import { WebsiteGroupWithCategories } from './components/WebsiteGroupWithCategories';

function App() {
  const {
    websites,
    isLoading,
    addWebsite,
    removeWebsite,
    updateWebsite,
  } = useStorage();

  if (isLoading) {
    return (
      <div className="w-[400px] min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[400px] min-h-[300px] h-[300px] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 mb-2">
            Startup Websites
          </h1>
        </div>

        <WebsiteGroupWithCategories
          onAddWebsite={addWebsite}
          websites={websites}
          onRemoveWebsite={removeWebsite}
          onUpdateWebsite={updateWebsite}
        />

        {websites.length === 0 && (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default App;
