<?php

namespace App\Command;

use App\Service\ImportService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import:xlsx',
    description: 'Importe un fichier XLSX dans la base de données',
)]
class ImportXlsxCommand extends Command
{
    private ImportService $importService;

    public function __construct(ImportService $importService)
    {
        parent::__construct();
        $this->importService = $importService;
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::REQUIRED, 'Chemin vers le fichier XLSX à importer')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $filePath = $input->getArgument('file');

        if (!file_exists($filePath)) {
            $io->error("Le fichier $filePath n'existe pas.");
            return Command::FAILURE;
        }

        $result = $this->importService->importXlsx($filePath, $input, $output);

        if ($result['success']) {
            $io->success($result['message']);
            return Command::SUCCESS;
        } else {
            $io->error($result['message']);
            return Command::FAILURE;
        }
    }
} 