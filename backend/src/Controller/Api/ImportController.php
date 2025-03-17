<?php

namespace App\Controller\Api;

use App\Service\ImportService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;

#[Route('/api/import')]
class ImportController extends AbstractController
{
    private ImportService $importService;
    
    public function __construct(ImportService $importService)
    {
        $this->importService = $importService;
    }
    
    #[Route('/xlsx', name: 'api_import_xlsx', methods: ['POST'])]
    public function importXlsx(Request $request): JsonResponse
    {
        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        
        if (!$file) {
            return $this->json(['success' => false, 'message' => 'Aucun fichier n\'a été envoyé.'], 400);
        }
        
        if ($file->getClientOriginalExtension() !== 'xlsx') {
            return $this->json(['success' => false, 'message' => 'Le fichier doit être au format XLSX.'], 400);
        }
        
        // Déplacer le fichier dans un répertoire temporaire
        $filename = md5(uniqid()) . '.xlsx';
        $filePath = sys_get_temp_dir() . '/' . $filename;
        $file->move(sys_get_temp_dir(), $filename);
        
        // Créer les objets Input et Output pour le service d'importation
        $input = new ArrayInput([]);
        $output = new BufferedOutput();
        
        // Importer les données
        $result = $this->importService->importXlsx($filePath, $input, $output);
        
        // Supprimer le fichier temporaire
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        // Ajouter la sortie de la console au résultat
        $result['output'] = $output->fetch();
        
        return $this->json($result);
    }
} 