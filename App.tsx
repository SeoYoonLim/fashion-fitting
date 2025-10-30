
import React, { useState, useMemo } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateFittingImage } from './services/geminiService';
import { ImageFile } from './types';

const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const TopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path d="M9 3v2m6-2v2" strokeLinecap="round" />
        <path d="M12 14l-2 3h4l-2-3z" />
        <path d="M4 11h16" />
        <path d="M5 21h14" />
        <path d="M9 11v-2a3 3 0 0 1 6 0v2" />
    </svg>
);

const BottomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-6l-4 6h16l-4-6-4 4-4-4z" />
        <path d="M8 4h8" />
        <path d="M6 20h12" />
    </svg>
);

const App: React.FC = () => {
    const [modelImage, setModelImage] = useState<ImageFile | null>(null);
    const [topImage, setTopImage] = useState<ImageFile | null>(null);
    const [bottomImage, setBottomImage] = useState<ImageFile | null>(null);

    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const modelPreviewUrl = useMemo(() => modelImage ? `data:${modelImage.mimeType};base64,${modelImage.base64}` : null, [modelImage]);
    const topPreviewUrl = useMemo(() => topImage ? `data:${topImage.mimeType};base64,${topImage.base64}` : null, [topImage]);
    const bottomPreviewUrl = useMemo(() => bottomImage ? `data:${bottomImage.mimeType};base64,${bottomImage.base64}` : null, [bottomImage]);


    const handleGenerate = async () => {
        if (!modelImage || !topImage || !bottomImage) {
            setError("Please upload all three images.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const generatedImage = await generateFittingImage(modelImage, topImage, bottomImage);
            setResultImage(generatedImage);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = isLoading || !modelImage || !topImage || !bottomImage;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Virtual Fitting Room AI
                    </h1>
                    <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                        Upload a model, top, and bottom to see the magic happen.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Panel: Inputs */}
                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-200">Upload Your Images</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <ImageUploader label="Model" icon={<PersonIcon />} onImageUpload={setModelImage} previewUrl={modelPreviewUrl} />
                            <ImageUploader label="Top" icon={<TopIcon />} onImageUpload={setTopImage} previewUrl={topPreviewUrl} />
                            <ImageUploader label="Bottom" icon={<BottomIcon />} onImageUpload={setBottomImage} previewUrl={bottomPreviewUrl} />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isButtonDisabled}
                            className={`w-full flex items-center justify-center text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                                isButtonDisabled
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transform hover:scale-105'
                            }`}
                        >
                             {isLoading && <Spinner />}
                             <span className={isLoading ? 'ml-3' : ''}>
                                {isLoading ? 'Generating...' : 'Create Fitting'}
                             </span>
                        </button>
                    </div>

                    {/* Right Panel: Output */}
                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center min-h-[400px] lg:min-h-0">
                       <div className="w-full h-full flex flex-col items-center justify-center aspect-square">
                            {isLoading && (
                                <div className="text-center">
                                    <Spinner />
                                    <p className="mt-4 text-gray-400">AI is creating your look... Please wait.</p>
                                </div>
                            )}
                            {error && !isLoading && (
                                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-2">Error</h3>
                                    <p>{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && resultImage && (
                                <img src={resultImage} alt="Generated fitting" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                            )}
                            {!isLoading && !error && !resultImage && (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-4 text-lg">Your generated image will appear here.</p>
                                </div>
                            )}
                       </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;

